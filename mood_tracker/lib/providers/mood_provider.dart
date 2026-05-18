// This file holds the application's state and business logic for mood tracking.
import 'package:flutter/foundation.dart';
import 'package:mood_tracker/models/mood_entry.dart';

// The MoodProvider class manages the state of the mood tracker.
// It uses the `ChangeNotifier` mixin, which allows it to notify listening
// widgets when the application's state changes.
class MoodProvider with ChangeNotifier {
  // --- STATE ---

  // A private variable to hold the currently selected mood. It's nullable
  // because no mood might be selected initially.
  MoodType? _selectedMood;

  // A private list to store the logged mood entries.
  final List<MoodEntry> _entries = [];

  // --- GETTERS ---

  // A public getter to allow UI components to read the currently selected mood.
  // This prevents the UI from directly modifying the state.
  MoodType? get selectedMood => _selectedMood;

  // A public getter that returns an unmodifiable view of the mood entries.
  // This prevents the list from being changed directly from the UI, enforcing
  // that all state modifications go through the provider's methods.
  List<MoodEntry> get entries => List.unmodifiable(_entries);

  // --- ACTIONS / MUTATIONS ---

  // A method to update the selected mood.
  void selectMood(MoodType mood) {
    // Update the internal state.
    _selectedMood = mood;
    // notifyListeners() tells any widgets that are listening to this provider
    // to rebuild themselves with the updated state.
    notifyListeners();
  }

  // A method to log the currently selected mood as a new entry.
  void addMood() {
    // Only proceed if a mood has been selected.
    if (_selectedMood != null) {
      // Add the new mood entry to the beginning of the list to show the most
      // recent entry first.
      _entries.insert(
        0,
        MoodEntry(type: _selectedMood!, date: DateTime.now()),
      );
      // To keep the UI clean, we only store and display the last 7 entries.
      if (_entries.length > 7) {
        _entries.removeLast();
      }
      // Reset the selected mood to null after logging it.
      _selectedMood = null;
      // Notify listeners to update the UI (e.g., to clear the selection and
      // show the new entry in the timeline).
      notifyListeners();
    }
  }
}