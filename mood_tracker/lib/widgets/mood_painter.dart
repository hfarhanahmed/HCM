import 'dart:math';

import 'package:flutter/material.dart';
import 'package:mood_tracker/models/mood_entry.dart';

class MoodPainter extends CustomPainter {
  final MoodType type;

  MoodPainter({required this.type});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Draw face background
    final facePaint = Paint()
      ..color = type.faceColor
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

  @override
  bool shouldRepaint(covariant MoodPainter oldDelegate) {
    return oldDelegate.type != type;
  }
}
