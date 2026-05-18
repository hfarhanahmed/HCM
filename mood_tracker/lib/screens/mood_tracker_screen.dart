import 'package:flutter/material.dart';
import 'package:mood_tracker/models/mood_entry.dart';
import 'package:mood_tracker/widgets/animated_timeline_entry.dart';
import 'package:mood_tracker/widgets/mood_painter.dart';

class MoodTrackerScreen extends StatefulWidget {
  const MoodTrackerScreen({super.key});

  @override
  State<MoodTrackerScreen> createState() => _MoodTrackerScreenState();
}

class _MoodTrackerScreenState extends State<MoodTrackerScreen> {
  MoodType? _selectedMood;
  final List<MoodEntry> _entries = [];

  void _addMood() {
    if (_selectedMood != null) {
      setState(() {
        _entries.insert(
          0,
          MoodEntry(type: _selectedMood!, date: DateTime.now()),
        );
        if (_entries.length > 7) {
          _entries.removeLast();
        }
        _selectedMood = null; // reset selection
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mood Tracker'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'How do you feel today?',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: MoodType.values.map((type) {
                final isSelected = _selectedMood == type;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedMood = type;
                    });
                  },
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: isSelected
                              ? Border.all(color: type.color, width: 4)
                              : Border.all(color: Colors.transparent, width: 4),
                        ),
                        padding: const EdgeInsets.all(4),
                        child: CustomPaint(
                          size: const Size(80, 80),
                          painter: MoodPainter(type: type),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(type.title),
                    ],
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),
            Center(
              child: ElevatedButton(
                onPressed: _selectedMood == null ? null : _addMood,
                child: const Text('Log Mood'),
              ),
            ),
            const Divider(height: 48),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(
                'Past 7 Entries',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: _entries.isEmpty
                  ? const Center(child: Text('No moods logged yet.'))
                  : ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _entries.length,
                      itemBuilder: (context, index) {
                        final entry = _entries[index];
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