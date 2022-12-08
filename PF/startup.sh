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
./tfcbackend/startup.sh

# frontend startup
cd tfcfrontend
npm install

cd ..