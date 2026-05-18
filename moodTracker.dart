import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

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
        brightness: Brightness.dark,
        primarySwatch: Colors.indigo,
        useMaterial3: true,
      ),
      home: const MoodTrackerScreen(),
    );
  }
}

enum MoodType { happy, neutral, sad }

class MoodEntry {
  final MoodType type;
  final DateTime timestamp;

  MoodEntry(this.type, this.timestamp);
}

class MoodTrackerScreen extends StatefulWidget {
  const MoodTrackerScreen({super.key});

  @override
  State<MoodTrackerScreen> createState() => _MoodTrackerScreenState();
}

class _MoodTrackerScreenState extends State<MoodTrackerScreen> {
  final List<MoodEntry> _history = [];

  void _addMood(MoodType type) {
    setState(() {
      _history.insert(0, MoodEntry(type, DateTime.now()));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const Padding(
              padding: EdgeInsets.only(top: 40, bottom: 20),
              child: Text(
                "How are you feeling?",
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
              ),
            ),
            
            // Interaction Area
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _MoodButton(type: MoodType.happy, color: Colors.greenAccent, onTap: () => _addMood(MoodType.happy)),
                _MoodButton(type: MoodType.neutral, color: Colors.yellowAccent, onTap: () => _addMood(MoodType.neutral)),
                _MoodButton(type: MoodType.sad, color: Colors.blueAccent, onTap: () => _addMood(MoodType.sad)),
              ],
            ),

            const Spacer(),
            
            // Timeline Title
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text("Past 7 Entries", style: TextStyle(fontSize: 18, color: Colors.grey)),
              ),
            ),

            // Timeline Horizontal Scroll
            SizedBox(
              height: 180,
              child: _history.isEmpty 
                ? const Center(child: Text("No entries yet.")) 
                : ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _history.length > 7 ? 7 : _history.length,
                    itemBuilder: (context, index) {
                      return TimelineCard(entry: _history[index]);
                    },
                  ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _MoodButton extends StatelessWidget {
  final MoodType type;
  final Color color;
  final VoidCallback onTap;

  const _MoodButton({required this.type, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            CustomPaint(
              size: const Size(80, 80),
              painter: MoodPainter(type: type, color: color),
            ),
            const SizedBox(height: 8),
            Text(type.name.toUpperCase(), style: TextStyle(color: color, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

class TimelineCard extends StatefulWidget {
  final MoodEntry entry;
  const TimelineCard({super.key, required this.entry});

  @override
  State<TimelineCard> createState() => _TimelineCardState();
}

class _TimelineCardState extends State<TimelineCard> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 200));
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  void _handleTap() async {
    await _controller.forward();
    _controller.reverse();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Color moodColor;
    switch (widget.entry.type) {
      case MoodType.happy: moodColor = Colors.greenAccent; break;
      case MoodType.neutral: moodColor = Colors.yellowAccent; break;
      case MoodType.sad: moodColor = Colors.blueAccent; break;
    }

    return GestureDetector(
      onTap: _handleTap,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          width: 120,
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: moodColor.withOpacity(0.3)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                DateFormat('MMM d, HH:mm').format(widget.entry.timestamp),
                style: const TextStyle(fontSize: 10, color: Colors.grey),
              ),
              const SizedBox(height: 10),
              CustomPaint(
                size: const Size(50, 50),
                painter: MoodPainter(type: widget.entry.type, color: moodColor),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// CustomPainter that draws faces manually using Canvas primitives
class MoodPainter extends CustomPainter {
  final MoodType type;
  final Color color;

  MoodPainter({required this.type, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // 1. Draw Face Circle
    final facePaint = Paint()
      ..color = color.withOpacity(0.2)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius, facePaint);

    final strokePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.width * 0.05
      ..strokeCap = StrokeCap.round;
    canvas.drawCircle(center, radius, strokePaint);

    // 2. Draw Eyes
    final eyePaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;
    
    double eyeOffsetX = size.width * 0.2;
    double eyeOffsetY = -size.height * 0.15;

    // Drawing different eyes for different moods
    if (type == MoodType.sad) {
      // Slanted sad eyebrows/eyes
      canvas.drawLine(
        center + Offset(-eyeOffsetX - 5, eyeOffsetY - 5),
        center + Offset(-eyeOffsetX + 5, eyeOffsetY),
        strokePaint
      );
      canvas.drawLine(
        center + Offset(eyeOffsetX + 5, eyeOffsetY - 5),
        center + Offset(eyeOffsetX - 5, eyeOffsetY),
        strokePaint
      );
    }
    
    // Default eye circles
    canvas.drawCircle(center + Offset(-eyeOffsetX, eyeOffsetY), size.width * 0.06, eyePaint);
    canvas.drawCircle(center + Offset(eyeOffsetX, eyeOffsetY), size.width * 0.06, eyePaint);

    // 3. Draw Mouth (using Arc or Path)
    final mouthPath = Path();
    
    if (type == MoodType.happy) {
      // Happy: Upward Arc
      Rect mouthRect = Rect.fromCenter(
        center: center + Offset(0, size.height * 0.1),
        width: size.width * 0.5,
        height: size.height * 0.4,
      );
      canvas.drawArc(mouthRect, 0.2, 2.8, false, strokePaint);
    } else if (type == MoodType.neutral) {
      // Neutral: Straight line
      canvas.drawLine(
        center + Offset(-size.width * 0.2, size.height * 0.2),
        center + Offset(size.width * 0.2, size.height * 0.2),
        strokePaint
      );
    } else {
      // Sad: Downward Arc
      Rect mouthRect = Rect.fromCenter(
        center: center + Offset(0, size.height * 0.35),
        width: size.width * 0.4,
        height: size.height * 0.3,
      );
      canvas.drawArc(mouthRect, 3.5, 2.5, false, strokePaint);
    }
  }

  @override
  bool shouldRepaint(covariant MoodPainter oldDelegate) => 
    oldDelegate.type != type || oldDelegate.color != color;
}