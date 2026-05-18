// Import the core Flutter material design library, which provides UI components
// following Material Design guidelines.
import 'package:flutter/material.dart';
// Import the screen that displays the main mood tracking interface.
import 'package:mood_tracker/screens/mood_tracker_screen.dart';
// Import the state management provider for mood data.
import 'package:mood_tracker/providers/mood_provider.dart';
// Import the provider package for state management.
import 'package:provider/provider.dart';

// The main entry point for the application. Flutter execution begins here.
void main() {
  // runApp() inflates the given widget and attaches it to the screen.
  // We wrap the entire app in a `ChangeNotifierProvider`.
  // This makes the `MoodProvider` instance available to all descendant widgets
  // in the widget tree, allowing them to access and modify the mood state.
  runApp(
    ChangeNotifierProvider(
      // The `create` callback is called when the provider is inserted into the
      // widget tree. It creates an instance of our MoodProvider.
      create: (context) => MoodProvider(),
      child: const MoodTrackerApp(),
    ),
  );
}

class MoodTrackerApp extends StatelessWidget {
  // Creates the MoodTrackerApp widget. The `key` is used to identify this
  // widget in the widget tree.
  const MoodTrackerApp({super.key});

  // The build method describes how to display the widget in terms of other,
  // lower-level widgets.
  @override
  Widget build(BuildContext context) {
    // MaterialApp is a convenience widget that wraps a number of widgets
    // that are commonly required for material design applications.
    return MaterialApp(
      // The title of the application, used by the device's task manager.
      title: 'Mood Tracker',
      // The visual theme for the application.
      theme: ThemeData(
        // Defines the color scheme for the application based on a seed color.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        // Enables the newer Material 3 design.
        useMaterial3: true,
      ),
      // The widget for the default route of the app (the "home" screen).
      home: const MoodTrackerScreen(),
    );
  }
}
