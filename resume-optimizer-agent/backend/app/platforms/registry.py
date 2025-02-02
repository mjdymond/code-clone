# backend/app/platforms/registry.py

from typing import Dict, Optional
from .base import BasePlatform

class PlatformRegistry:
    """Registry for job platforms"""
    
    def __init__(self):
        self._platforms: Dict[str, BasePlatform] = {}
    
    def register(self, platform: BasePlatform):
        """Register a new platform"""
        self._platforms[platform.platform_name] = platform
    
    def get_platform(self, platform_name: str) -> Optional[BasePlatform]:
        """Get platform by name"""
        return self._platforms.get(platform_name)
    
    def get_all_platforms(self) -> Dict[str, BasePlatform]:
        """Get all registered platforms"""
        return self._platforms.copy()

# Create global registry instance
platform_registry = PlatformRegistry()