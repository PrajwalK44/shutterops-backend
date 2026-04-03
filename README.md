# ShutterOps

Photography Operations Management System built as an Android application for managing events, teams, and equipment workflows in one place.

## Project Overview

ShutterOps is a lab-focused Android project that demonstrates practical mobile development concepts through a clean and modular app structure. The app includes modern UI design, multi-screen navigation, fragment-based architecture, and event-driven interactions with gesture support.

## Features Implemented (Up to Experiment 4)

- **Experiment 2: UI Design**
  - ConstraintLayout-based responsive screens
  - CardView-based clean visual hierarchy
  - RecyclerView-based list rendering
- **Experiment 3: Navigation + Fragment Integration**
  - Multi-screen navigation using Intents
  - LoginActivity -> DashboardActivity flow
  - Dashboard with modular fragments (Home, Events, Equipment)
- **Experiment 4: Event-Driven Interactions**
  - Button-based interactions in Home fragment
  - RecyclerView item interactions in Events and Equipment
  - Gesture-based actions (click, long press, swipe)

## Gestures Implemented

- **Click**
  - Fragment navigation and item click Toast feedback
- **Long Press**
  - Item delete (list interactions)
  - Equipment status update via AlertDialog
- **Swipe**
  - Fragment navigation using ViewPager2 (Events <-> Home <-> Equipment)
  - Swipe actions on list items with immediate visual updates

## App Structure

- **Activities**
  - LoginActivity
  - DashboardActivity
- **Fragments**
  - HomeFragment
  - EventsFragment
  - EquipmentFragment
- **Lists and Adapters**
  - RecyclerView + ViewHolder pattern
  - Dedicated adapters for Events and Equipment

## Hard-Coded Data

Dummy data is used for development/testing purposes:

- **Events**: sample event title, date, and location entries
- **Equipment**: sample equipment name and status entries

No backend/API dependency is required for current implementation.

## How to Run

1. Clone the repository.
2. Open the project in Android Studio.
3. Let Gradle sync complete.
4. Run the app on an emulator or physical Android device.

```bash
git clone <your-repo-url>
cd ShutterOps
```

## How to Test Features

1. Launch app and login from Login screen.
2. Verify navigation to Dashboard.
3. Swipe between fragments (Events, Home, Equipment).
4. In list screens:
   - Tap item -> Toast message
   - Long press equipment item -> change status from dialog
   - Swipe item -> perform action and update list

## Tech Stack

- Java
- Android SDK
- RecyclerView
- ViewPager2
- Material Components
- ConstraintLayout

## Future Work

- API integration for live event/equipment data
- Firebase Authentication and cloud sync
- Real-time updates and team collaboration features
