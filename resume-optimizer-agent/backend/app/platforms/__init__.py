# backend/app/platforms/__init__.py

from .linkedin import linkedin_platform
from .base import BasePlatform
from .registry import platform_registry

# Register platforms
platform_registry.register(linkedin_platform)

__all__ = ['platform_registry', 'BasePlatform', 'linkedin_platform']