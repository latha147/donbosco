from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)
    head = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Teacher(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    email = models.EmailField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    def __str__(self):
        return self.name

class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    roll_number = models.CharField(max_length=20)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    def __str__(self):
        return self.name

class Attendance(models.Model):
    STATUS_CHOICES = [('Present', 'Present'), ('Absent', 'Absent')]
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    def __str__(self):
        return f"{self.student.name} - {self.date} - {self.status}"
class Timetable(models.Model):
    teacher    = models.ForeignKey('Teacher', on_delete=models.CASCADE)
    day        = models.CharField(max_length=10)   # "Mon", "Tue" etc
    period     = models.CharField(max_length=20)   # "9:00-10:00"
    subject    = models.CharField(max_length=100)
    room       = models.CharField(max_length=50)
    type       = models.CharField(max_length=20, default="Theory")  # Theory/Lab/Free

    class Meta:
        unique_together = ('teacher', 'day', 'period')