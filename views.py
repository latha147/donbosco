from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Student, Teacher, Attendance, Department


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({'access': str(refresh.access_token)})
    return Response({'error': 'Invalid credentials'}, status=400)


@api_view(['GET'])
def student_list(request):
    students = Student.objects.all()
    data = [{'id': s.id, 'name': s.name, 'email': s.email,
             'roll_number': s.roll_number, 'department_id': s.department_id}
            for s in students]
    return Response(data)


@api_view(['GET'])
def teacher_list(request):
    teachers = Teacher.objects.all()
    data = [{'id': t.id, 'name': t.name, 'subject': t.subject,
             'email': t.email} for t in teachers]
    return Response(data)


@api_view(['GET'])
def department_list(request):
    departments = Department.objects.all()
    data = [{'id': d.id, 'name': d.name, 'head': d.head}
            for d in departments]
    return Response(data)


@api_view(['GET'])
def attendance_list(request):
    month = request.GET.get('month')
    if month:
        records = Attendance.objects.filter(date__startswith=month)
    else:
        records = Attendance.objects.all()
    data = [{'id': r.id, 'student_id': r.student_id,
             'date': str(r.date), 'status': r.status}
            for r in records]
    return Response(data)


@api_view(['POST'])
def attendance_bulk_save(request):
    records = request.data
    if not isinstance(records, list):
        return Response({'error': 'Expected a list'}, status=400)
    saved = 0
    for rec in records:
        student_id = rec.get('student_id')
        date = rec.get('date')
        att_status = rec.get('status')
        if not all([student_id, date, att_status]):
            continue
        Attendance.objects.update_or_create(
            student_id=student_id, date=date,
            defaults={'status': att_status}
        )
        saved += 1
    return Response({'message': f'Saved {saved} records'})


@api_view(['GET'])
def attendance_summary(request):
    month = request.GET.get('month')
    students = Student.objects.all()
    summary = []
    for s in students:
        records = Attendance.objects.filter(
            student=s, date__startswith=month) if month else Attendance.objects.filter(student=s)
        present = records.filter(status='Present').count()
        absent = records.filter(status='Absent').count()
        total = present + absent
        pct = round((present / total) * 100, 1) if total > 0 else 0
        summary.append({
            'student_id': s.id, 'name': s.name,
            'roll_number': s.roll_number,
            'present': present, 'absent': absent,
            'total': total, 'percentage': pct
        })
    return Response(summary)