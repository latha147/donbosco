from django.contrib import admin
from .models import Department, Teacher, Student, Attendance

admin.site.register(Department)
admin.site.register(Teacher)
admin.site.register(Student)
admin.site.register(Attendance)