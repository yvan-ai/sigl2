from django.test import TestCase
from rest_framework.exceptions import ValidationError
from .models import Utilisateur
from .serializers import CustomUserSerializer

class CustomUserSerializerTest(TestCase):
    def test_create_user_valid(self):
        data = {
            'email': 'testuser@example.com',
            'user_type': 2,
            'first_name': 'Test',
            'last_name': 'User',
            'is_responsable_cursus': False
        }
        serializer = CustomUserSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.email, 'testuser@example.com')

    def test_create_user_invalid_email(self):
        data = {
            'email': '',
            'user_type': 2,
            'first_name': 'Test',
            'last_name': 'User',
            'is_responsable_cursus': False
        }
        serializer = CustomUserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)



from django.test import TestCase
from django.db import IntegrityError
from django.contrib.auth import get_user_model
from .models import (Admin, TuteurPedagogique, Enseignant, Apprenti, Entreprise, 
                     MaitreApprentissage, CoordinatriceApprentissage, Notification)
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError

class CustomUserManagerTests(TestCase):

    def test_create_user(self):
        user = get_user_model().objects.create_user(
            email='user@example.com', password='testpassword'
        )
        self.assertEqual(user.email, 'user@example.com')
        self.assertTrue(user.check_password('testpassword'))
        self.assertEqual(user.user_type, 2)  # default user_type 'Apprenti'

    def test_create_superuser(self):
        user = get_user_model().objects.create_superuser(
            email='admin@example.com', password='testpassword'
        )
        self.assertEqual(user.email, 'admin@example.com')
        self.assertTrue(user.check_password('testpassword'))
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertEqual(user.user_type, 1)  # user_type 'Admin'

    def test_create_user_without_email(self):
        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(
                email='', password='testpassword'
            )

    def test_create_superuser_without_email(self):
        with self.assertRaises(ValueError):
            get_user_model().objects.create_superuser(
                email='', password='testpassword'
            )
class SignalTests(TestCase):

    def test_create_user_profile_on_save(self):
        user = get_user_model().objects.create_user(
            email='newuser@example.com', password='testpassword', user_type=3
        )
        tuteur_pedagogique = TuteurPedagogique.objects.get(user=user)
        self.assertEqual(tuteur_pedagogique.user.email, 'newuser@example.com')


class UserModelTests(TestCase):

    def test_user_type_choices(self):
        user = get_user_model().objects.create_user(
            email='user@example.com', password='testpassword', user_type=4
        )
        self.assertEqual(user.user_type, 4)  # user_type 'Enseignant'

class UserModelIntegrityTests(TestCase):

    def test_email_unique_constraint(self):
        get_user_model().objects.create_user(
            email='user@example.com', password='testpassword'
        )
        with self.assertRaises(IntegrityError):
            get_user_model().objects.create_user(
                email='user@example.com', password='anotherpassword'
            )

 
   