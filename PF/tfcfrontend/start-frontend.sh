# Remove current venv if it exists
rm -rf venv

# Create new virtualenv
python3 -m virtualenv -v venv

# Activate the virtual environment
source venv/bin/activate

# Install node dependencies
npm install