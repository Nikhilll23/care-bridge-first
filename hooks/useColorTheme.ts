'use client';

import { useState, useEffect, useCallback } from 'react';
import { colorCombinations, getColorByContext, getContrastingText, type ColorContext, type ColorName } from '@/lib/colors';

interface ColorThemeState {
  primaryColor: ColorName;
  accentColor: ColorName;
  isDarkMode: boolean;
}

export const useColorTheme = () => {
  const [themeState, setThemeState] = useState<ColorThemeState>({
    primaryColor: 'navy',
    accentColor: 'plum',
    isDarkMode: false,
  });

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('color-theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setThemeState(prev => ({
          ...prev,
          ...parsed,
          isDarkMode: parsed.isDarkMode ?? systemDarkMode,
        }));
      } catch (error) {
        console.warn('Failed to parse saved color theme:', error);
      }
    } else {
      setThemeState(prev => ({ ...prev, isDarkMode: systemDarkMode }));
    }

    // Apply dark mode class to document
    document.documentElement.classList.toggle('dark', themeState.isDarkMode);
  }, []);

  // Save theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('color-theme', JSON.stringify(themeState));
    document.documentElement.classList.toggle('dark', themeState.isDarkMode);
  }, [themeState]);

  // Theme manipulation functions
  const toggleDarkMode = useCallback(() => {
    setThemeState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  const setPrimaryColor = useCallback((color: ColorName) => {
    setThemeState(prev => ({ ...prev, primaryColor: color }));
  }, []);

  const setAccentColor = useCallback((color: ColorName) => {
    setThemeState(prev => ({ ...prev, accentColor: color }));
  }, []);

  const resetToDefault = useCallback(() => {
    setThemeState({
      primaryColor: 'navy',
      accentColor: 'plum',
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    });
  }, []);

  // Utility functions for getting themed classes
  const getThemedClasses = useCallback((context: ColorContext) => {
    return colorCombinations[context];
  }, []);

  const getContextualColor = useCallback((context: 'success' | 'info' | 'brand' | 'neutral' | 'highlight') => {
    return getColorByContext(context);
  }, []);

  const getContrastText = useCallback((bgColor: ColorName) => {
    return getContrastingText(bgColor);
  }, []);

  // Generate dynamic CSS custom properties
  const generateCustomProperties = useCallback(() => {
    const properties = new Map<string, string>();
    
    // Add primary color variations
    properties.set('--theme-primary', `var(--${themeState.primaryColor})`);
    properties.set('--theme-accent', `var(--${themeState.accentColor})`);
    
    return Object.fromEntries(properties);
  }, [themeState]);

  return {
    // State
    theme: themeState,
    isDarkMode: themeState.isDarkMode,
    primaryColor: themeState.primaryColor,
    accentColor: themeState.accentColor,
    
    // Actions
    toggleDarkMode,
    setPrimaryColor,
    setAccentColor,
    resetToDefault,
    
    // Utilities
    getThemedClasses,
    getContextualColor,
    getContrastText,
    generateCustomProperties,
    
    // Pre-built class combinations
    classes: {
      primary: getThemedClasses('primary'),
      secondary: getThemedClasses('secondary'),
      success: getThemedClasses('success'),
      info: getThemedClasses('info'),
      highlight: getThemedClasses('highlight'),
      neutral: getThemedClasses('neutral'),
    },
  };
};

// Context provider for global theme management
export type ColorThemeContextType = ReturnType<typeof useColorTheme>;
