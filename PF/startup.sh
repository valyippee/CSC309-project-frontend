# Remove current venv if it exists
rm -rf venv

# Upgrade pip
python3 -m pip install --upgrade pip

# Install virtualenv
python3 -m pip install virtualenv

# Create new virtualenv
python3 -m virtualenv -v venv

# Activate the virtual environment
source venv/bin/activate

# backend startup
cd tfcbackend

# Install Django dependencies
pip3 install -r requirements.txt

# Run migrations
python3 manage.py migrate

# Add cron job to check payments due today
python3 manage.py crontab add

# Populate database with initial data
python3 manage.py populate_db

# frontend startup
cd ../tfcfrontend
npm install

cd ..