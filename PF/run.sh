# run backend server
cd tfcbackend

# Start the Django server
python3 $(dirname "$0")/manage.py runserver &

# Create an admin user
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@mail.com').exists() or \
User.objects.create_superuser('admin@mail.com', 'password')" | python manage.py shell


# run frontend server
cd ../tfcfrontend
npm start

cd ..