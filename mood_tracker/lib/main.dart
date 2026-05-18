import 'package:flutter/material.dart';
import 'dart:math';

void main() {
  runApp(const MoodTrackerApp());
}

class MoodTrackerApp extends StatelessWidget {
  const MoodTrackerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mood Tracker',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MoodTrackerScreen(),
    );
  }
}

enum MoodType { happy, neutral, sad }

class MoodEntry {
  final MoodType type;
  final DateTime date;

  MoodEntry({required this.type, required this.date});
}

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

  Color _getMoodColor(MoodType type) {
    switch (type) {
      case MoodType.happy:
        return Colors.green;
      case MoodType.neutral:
        return Colors.amber;
      case MoodType.sad:
        return Colors.blue;
    }
  }

  String _getMoodTitle(MoodType type) {
    switch (type) {
      case MoodType.happy:
        return 'Happy';
      case MoodType.neutral:
        return 'Neutral';
      case MoodType.sad:
        return 'Sad';
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
                              ? Border.all(color: _getMoodColor(type), width: 4)
                              : Border.all(color: Colors.transparent, width: 4),
                        ),
                        padding: const EdgeInsets.all(4),
                        child: CustomPaint(
                          size: const Size(80, 80),
                          painter: MoodPainter(type: type),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(_getMoodTitle(type)),
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

class AnimatedTimelineEntry extends StatefulWidget {
  final MoodEntry entry;

  const AnimatedTimelineEntry({super.key, required this.entry});

  @override
  State<AnimatedTimelineEntry> createState() => _AnimatedTimelineEntryState();
}

class _AnimatedTimelineEntryState extends State<AnimatedTimelineEntry>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    _scaleAnimation = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.2), weight: 1),
      TweenSequenceItem(tween: Tween(begin: 1.2, end: 1.0), weight: 1),
    ]).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Color _getMoodColor(MoodType type) {
    switch (type) {
      case MoodType.happy:
        return Colors.green;
      case MoodType.neutral:
        return Colors.amber;
      case MoodType.sad:
        return Colors.blue;
    }
  }

  String _getMoodTitle(MoodType type) {
    switch (type) {
      case MoodType.happy:
        return 'Happy';
      case MoodType.neutral:
        return 'Neutral';
      case MoodType.sad:
        return 'Sad';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day} ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        _controller.forward(from: 0.0);
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_formatDate(widget.entry.date)),
            const SizedBox(height: 8),
            ScaleTransition(
              scale: _scaleAnimation,
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: _getMoodColor(widget.entry.type).withOpacity(0.4),
                      blurRadius: 8,
                      spreadRadius: 2,
                    ),
                  ],
                ),
                child: CustomPaint(
                  size: const Size(60, 60),
                  painter: MoodPainter(type: widget.entry.type),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(_getMoodTitle(widget.entry.type)),
          ],
        ),
      ),
    );
  }
}

class MoodPainter extends CustomPainter {
  final MoodType type;

  MoodPainter({required this.type});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Draw face background
    final facePaint = Paint()
      ..color = _getFaceColor(type)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius, facePaint);

    // Draw border
    final borderPaint = Paint()
      ..color = Colors.black87
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;
    canvas.drawCircle(center, radius, borderPaint);

    // Draw eyes
    final eyePaint = Paint()
      ..color = Colors.black87
      ..style = PaintingStyle.fill;

    final eyeRadius = radius * 0.15;
    final leftEyeCenter = Offset(
      center.dx - radius * 0.35,
      center.dy - radius * 0.2,
    );
    final rightEyeCenter = Offset(
      center.dx + radius * 0.35,
      center.dy - radius * 0.2,
    );

    canvas.drawCircle(leftEyeCenter, eyeRadius, eyePaint);
    canvas.drawCircle(rightEyeCenter, eyeRadius, eyePaint);

    // Draw eyebrows and mouth based on mood
    final featurePaint = Paint()
      ..color = Colors.black87
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;

    final mouthPath = Path();

    switch (type) {
      case MoodType.happy:
        // Eyebrows
        canvas.drawLine(
          Offset(
            leftEyeCenter.dx - radius * 0.2,
            leftEyeCenter.dy - radius * 0.2,
          ),
          Offset(
            leftEyeCenter.dx + radius * 0.1,
            leftEyeCenter.dy - radius * 0.3,
          ),
          featurePaint,
        );
        canvas.drawLine(
          Offset(
            rightEyeCenter.dx + radius * 0.2,
            rightEyeCenter.dy - radius * 0.2,
          ),
          Offset(
            rightEyeCenter.dx - radius * 0.1,
            rightEyeCenter.dy - radius * 0.3,
          ),
          featurePaint,
        );
        // Smile
        final smileRect = Rect.fromCircle(
          center: Offset(center.dx, center.dy + radius * 0.1),
          radius: radius * 0.5,
        );
        mouthPath.addArc(smileRect, 0.1 * pi, 0.8 * pi);
        break;
      case MoodType.neutral:
        // Straight mouth
        mouthPath.moveTo(center.dx - radius * 0.4, center.dy + radius * 0.3);
        mouthPath.lineTo(center.dx + radius * 0.4, center.dy + radius * 0.3);
        break;
      case MoodType.sad:
        // Eyebrows
        canvas.drawLine(
          Offset(
            leftEyeCenter.dx - radius * 0.2,
            leftEyeCenter.dy - radius * 0.3,
          ),
          Offset(
            leftEyeCenter.dx + radius * 0.1,
            leftEyeCenter.dy - radius * 0.2,
          ),
          featurePaint,
        );
        canvas.drawLine(
          Offset(
            rightEyeCenter.dx + radius * 0.2,
            rightEyeCenter.dy - radius * 0.3,
          ),
          Offset(
            rightEyeCenter.dx - radius * 0.1,
            rightEyeCenter.dy - radius * 0.2,
          ),
          featurePaint,
        );
        // Frown
        final frownRect = Rect.fromCircle(
          center: Offset(center.dx, center.dy + radius * 0.6),
          radius: radius * 0.5,
        );
        mouthPath.addArc(frownRect, 1.1 * pi, 0.8 * pi);
        break;
    }

    canvas.drawPath(mouthPath, featurePaint);
  }

  Color _getFaceColor(MoodType type) {
    switch (type) {
      case MoodType.happy:
        return Colors.green.shade300;
      case MoodType.neutral:
        return Colors.amber.shade300;
      case MoodType.sad:
        return Colors.blue.shade300;
    }
  }

  @override
  bool shouldRepaint(covariant MoodPainter oldDelegate) {
    return oldDelegate.type != type;
  }
}
