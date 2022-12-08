# Activate the virtual environment
source ../venv/bin/activate

# Install Django dependencies
pip3 install -r $(dirname "$0")/requirements.txt

# Run migrations
python3 $(dirname "$0")/manage.py migrate

# Add cron job to check payments due today
python3 $(dirname "$0")/manage.py crontab add

# Populate database with initial data
python3 $(dirname "$0")/manage.py populate_db