# GreenWatch — Smart Agriculture Mobile App

## Overview

GreenWatch is a full-featured agriculture mobile app built with Expo (React Native) for Indian farmers. It provides weather data, crop recommendations, live market prices, and a peer-to-peer produce marketplace.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **Mobile**: Expo (React Native) with Expo Router for file-based navigation
- **State management**: React Context + AsyncStorage for persistence
- **API calls**: @tanstack/react-query
- **Typography**: Inter font family (400/500/600/700)
- **Icons**: @expo/vector-icons (Feather)
- **Backend**: Express 5 (artifacts/api-server)

## App Screens

1. **Home Dashboard** (`app/(tabs)/index.tsx`) — Weather summary, crop tips, market highlights, quick actions
2. **Weather** (`app/(tabs)/weather.tsx`) — Current weather + 5-day forecast using device location + OpenWeather API
3. **Crop Advisor** (`app/(tabs)/crops.tsx`) — Recommendations based on soil type and season
4. **Market Prices** (`app/(tabs)/market.tsx`) — Searchable, sortable table of mandi prices
5. **Marketplace** (`app/(tabs)/marketplace.tsx`) — Browse products from farmers
6. **Add Product** (`app/add-product.tsx`) — List produce for sale
7. **Product Detail** (`app/product/[id].tsx`) — View details + contact seller (call/WhatsApp)
8. **Profile** (`app/(tabs)/profile.tsx`) — User info, listings, sign out
9. **Login** (`app/auth/login.tsx`) — Authentication (demo credentials pre-filled)
10. **Register** (`app/auth/register.tsx`) — New user sign up

## Key Files

- `constants/colors.ts` — Green-themed design tokens (primary: #2d7a2d)
- `context/AuthContext.tsx` — JWT-like auth with AsyncStorage persistence
- `context/MarketplaceContext.tsx` — Products state with local persistence
- `lib/cropData.ts` — Crop recommendation engine (soil × season matrix)
- `lib/mockData.ts` — Market prices, sample products, crop tips

## Environment Variables

- `EXPO_PUBLIC_OWM_KEY` — OpenWeatherMap API key (optional; falls back to mock data if not set)
- `EXPO_PUBLIC_DOMAIN` — Set automatically by Replit environment

## Key Commands

- `pnpm --filter @workspace/greenwatch run dev` — Start Expo dev server
- `pnpm run typecheck` — Full typecheck across all packages

## Design

- **Theme**: Green/nature-inspired (forest green #2d7a2d)
- **Font**: Inter (all weights)
- **Radius**: 12px cards, 20px weather card
- **Language**: English UI with support for Indian market context (₹ currency, quintal units, mandi prices)

## Features Implemented

- Secure authentication with JWT (mock, demo credentials pre-filled)
- Location-based weather with OpenWeather API fallback
- Crop recommendation engine (4 soil types × 4 seasons)
- Live market prices with search and sort
- Marketplace with search/filter by category, crop, location
- Add product form with category, unit, quantity, price
- Product detail with Call + WhatsApp contact options
- User profile with editable farm details and listing management
- AsyncStorage persistence for auth and user products
- Pull-to-refresh on weather and home
- Loading states, empty states, error handling throughout
