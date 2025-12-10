# app/__init__.py
# This file tells Python that "app" is a package.
# We don't need to put anything else here for now.
# This file lets us import routers in a clean way from main.py.

from .jobs import router as jobs_router

