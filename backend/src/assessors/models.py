from django.db import models

from core.utils.validators import not_negative_value_validator, day_hours_validator
from projects.models import Project
from users.models import Manager


class AssessorStatus(models.TextChoices):
    FULL = ('full', 'Полная загрузка')
    PARTIAL = ('partial', 'Частичная загрузка')
    FREE = ('free', 'Свободен')


class AssessorState(models.TextChoices):
    WORK = ('work', 'Работает')
    BLACKLIST = ('blacklist', 'Черный список')
    FIRED = ('fired', 'Уволен по собственному желанию')


class FreeResourceHours(models.TextChoices):
    NULL = ('0', '0')
    TWO_FOUR = ('2-4', '2-4')
    FOUR_SIX = ('4-6', '4-6')
    SIX_EIGHT = ('6-8', '6-8')


class Skill(models.Model):
    title = models.CharField(
        verbose_name='название',
        unique=True,
        max_length=150
    )

    class Meta:
        db_table = 'skills'
        verbose_name = 'навык'
        verbose_name_plural = 'навыки'

    def __str__(self):
        if len(str(self.title)) > 30:
            return f'{str(self.title)[:27]}...'

        return self.title


class Assessor(models.Model):
    username = models.CharField(
        max_length=150,
        unique=True,
        error_messages={
            'unique': 'Исполнитель с таким именем пользователя уже существует.',
        },
        verbose_name='имя пользователя'
    )
    last_name = models.CharField(
        max_length=255,
        verbose_name='фамилия'
    )
    first_name = models.CharField(
        max_length=255,
        verbose_name='имя'
    )
    middle_name = models.CharField(
        max_length=255,
        verbose_name='отчество'
    )
    email = models.EmailField(
        verbose_name='эл. почта',
        unique=True
    )
    country = models.CharField(
        max_length=255,
        verbose_name='страна'
    )
    manager = models.ForeignKey(
        Manager,
        on_delete=models.PROTECT,
        verbose_name='менеджер',
        related_name='assessor',
        null=True,
        blank=True
    )
    projects = models.ManyToManyField(
        Project,
        blank=True,
        verbose_name='проекты',
        related_name='assessors'
    )
    status = models.CharField(
        verbose_name='статус',
        max_length=10,
        choices=AssessorStatus.choices,
        default=AssessorStatus.FREE
    )
    skills = models.ManyToManyField(
        to=Skill,
        verbose_name='навыки',
        blank=True
    )
    is_free_resource = models.BooleanField(
        default=False,
        verbose_name='св. ресурс'
    )
    free_resource_weekday_hours = models.CharField(
        max_length=5,
        verbose_name='ресурс работы в рабочие дни, ч',
        choices=FreeResourceHours.choices,
        null=True,
        blank=True
    )
    free_resource_day_off_hours = models.CharField(
        max_length=5,
        verbose_name='ресурс работы в выходные дни, ч',
        choices=FreeResourceHours.choices,
        null=True,
        blank=True
    )
    second_manager = models.ManyToManyField(
        Manager,
        blank=True,
        related_name='extra',
        verbose_name='доп. менеджеры'
    )
    state = models.CharField(
        verbose_name='состояние',
        max_length=10,
        choices=AssessorState.choices,
        default=AssessorState.WORK
    )
    date_of_registration = models.DateField(
        auto_now_add=True,
        verbose_name='дата регистрации'
    )

    class Meta:
        db_table = 'assessors'
        verbose_name = 'исполнитель'
        verbose_name_plural = 'исполнители'

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        return f'{self.last_name} {self.first_name} {self.middle_name}'

    @property
    def all_projects(self):
        if self.projects.exists():
            return '; '.join([pr.name for pr in self.projects.all()])
        return '-'


class WorkingHours(models.Model):
    assessor = models.OneToOneField(
        to=Assessor,
        on_delete=models.PROTECT,
        verbose_name='исполнитель'
    )
    monday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='понедельник',
        default=0
    )
    tuesday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='вторник',
        default=0
    )
    wednesday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='среда',
        default=0
    )
    thursday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='четверг',
        default=0
    )
    friday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='пятница',
        default=0
    )
    saturday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='суббота',
        default=0
    )
    sunday = models.IntegerField(
        validators=[not_negative_value_validator, day_hours_validator],
        verbose_name='воскресенье',
        default=0
    )

    class Meta:
        db_table = 'working_hours'
        verbose_name = 'рабочие часы'
        verbose_name_plural = 'рабочие часы'

    @property
    def total(self):
        return (self.monday + self.tuesday + self.wednesday +
                self.thursday + self.friday + self.saturday + self.sunday)


class BaseReasonModel(models.Model):
    title = models.CharField(
        verbose_name='причина',
        max_length=255
    )

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.title)


class BaseStateModel(models.Model):
    assessor = models.OneToOneField(
        Assessor,
        verbose_name='исполнитель',
        on_delete=models.PROTECT
    )
    date = models.DateField(
        verbose_name='дата',
        auto_now_add=True
    )

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.assessor)


class FiredReason(BaseReasonModel):
    class Meta:
        db_table = 'fired_reasons'
        verbose_name = 'причина увольнения'
        verbose_name_plural = 'причины увольнения'


class BlackListReason(BaseReasonModel):
    class Meta:
        db_table = 'blacklist_reasons'
        verbose_name = 'причина добавления в ЧС'
        verbose_name_plural = 'причины добавления в ЧС'


class Fired(BaseStateModel):
    reason = models.ForeignKey(
        FiredReason,
        verbose_name='причина',
        on_delete=models.PROTECT
    )

    class Meta:
        db_table = 'fired'
        verbose_name = 'уволенный'
        verbose_name_plural = 'уволенные'


class BlackList(BaseStateModel):
    reason = models.ForeignKey(
        BlackListReason,
        verbose_name='причина',
        on_delete=models.PROTECT
    )

    class Meta:
        db_table = 'blacklist'
        verbose_name = 'черный список'
        verbose_name_plural = 'черные списки'
