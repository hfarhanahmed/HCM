import 'package:flutter/material.dart';
import 'package:mood_tracker/models/mood_entry.dart';
import 'package:mood_tracker/providers/mood_provider.dart';
import 'package:mood_tracker/widgets/animated_timeline_entry.dart';
import 'package:mood_tracker/widgets/mood_painter.dart';
import 'package:provider/provider.dart';

// The MoodTrackerScreen is the main UI for the application.
// It's a StatelessWidget because it doesn't manage any state directly.
// Instead, it relies on the `MoodProvider` to get the state and to perform actions.
class MoodTrackerScreen extends StatelessWidget {
  // Creates the MoodTrackerScreen widget.
  const MoodTrackerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Use `context.watch<MoodProvider>()` to get the provider instance and
    // subscribe this widget to its changes. Whenever `notifyListeners()` is called
    // in `MoodProvider`, this `build` method will be re-run.
    final moodProvider = context.watch<MoodProvider>();
    // Get the current state from the provider.
    final selectedMood = moodProvider.selectedMood;
    final entries = moodProvider.entries;

    // Scaffold provides the basic structure of a visual interface.
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mood Tracker'),
        // Sets the background color of the AppBar from the app's theme.
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      // SafeArea ensures that the content is not obscured by system intrusions
      // like notches or status bars.
      body: SafeArea(
        child: Column(
          // Aligns children to the start of the cross axis (horizontally for a Column).
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // --- Mood Selection Section ---
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'How do you feel today?',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ),
            // A row to display the selectable mood faces.
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              // Create a mood selector widget for each MoodType.
              children: MoodType.values.map((type) {
                final isSelected = selectedMood == type;
                // GestureDetector detects user taps on the mood face.
                return GestureDetector(
                  onTap: () {
                    // Use `context.read<MoodProvider>()` to call a method on the
                    // provider without subscribing to changes. This is efficient
                    // for one-off actions triggered by user interaction.
                    context.read<MoodProvider>().selectMood(type);
                  },
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Container for the mood face with a border for selection highlight.
                      Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          // Show a colored border if this mood is selected.
                          border: isSelected
                              ? Border.all(color: type.color, width: 4)
                              : Border.all(color: Colors.transparent, width: 4),
                        ),
                        padding: const EdgeInsets.all(4),
                        // CustomPaint uses a MoodPainter to draw the face.
                        child: CustomPaint(
                          size: const Size(80, 80),
                          painter: MoodPainter(type: type),
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Display the title of the mood (e.g., "Happy").
                      Text(type.title),
                    ],
                  ),
                );
              }).toList(), // Convert the mapped iterable to a list of widgets.
            ),
            const SizedBox(height: 24),
            // --- Log Mood Button ---
            Center(
              child: ElevatedButton(
                // The button is disabled if no mood is selected.
                onPressed: selectedMood == null
                    ? null
                    // When pressed, call the `addMood` method on the provider.
                    : () => context.read<MoodProvider>().addMood(),
                child: const Text('Log Mood'),
              ),
            ),
            const Divider(height: 48), // A visual separator.
            // --- Past Entries Section ---
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(
                'Past 7 Entries',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 16),
            // Expanded widget takes up the remaining vertical space.
            Expanded(
              // Show a message if there are no entries, otherwise show the list.
              child: entries.isEmpty
                  ? const Center(child: Text('No moods logged yet.'))
                  : ListView.builder(
                      // The list scrolls horizontally.
                      scrollDirection: Axis.horizontal,
                      itemCount: entries.length,
                      itemBuilder: (context, index) {
                        final entry = entries[index];
                        // Each item in the list is an AnimatedTimelineEntry widget.
                        return AnimatedTimelineEntry(entry: entry);
                      },
                    ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}