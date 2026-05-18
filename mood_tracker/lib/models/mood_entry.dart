import 'package:flutter/material.dart';

enum MoodType { happy, neutral, sad }

extension MoodTypeExtensions on MoodType {
  Color get color {
    switch (this) {
      case MoodType.happy:
        return Colors.green;
      case MoodType.neutral:
        return Colors.amber;
      case MoodType.sad:
        return Colors.blue;
    }
  }

  Color get faceColor {
    switch (this) {
      case MoodType.happy:
        return Colors.green.shade300;
      case MoodType.neutral:
        return Colors.amber.shade300;
      case MoodType.sad:
        return Colors.blue.shade300;
    }
  }

  String get title {
    switch (this) {
      case MoodType.happy:
        return 'Happy';
      case MoodType.neutral:
        return 'Neutral';
      case MoodType.sad:
        return 'Sad';
    }
  }
}

class MoodEntry {
  final MoodType type;
  final DateTime date;

  MoodEntry({required this.type, required this.date});
}