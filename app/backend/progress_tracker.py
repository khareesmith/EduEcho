from typing import Dict, List
import json
from datetime import datetime
from pathlib import Path
import os

class ProgressTracker:
    def __init__(self, storage_dir: str = "progress_data"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)
        
    def save_interaction(self, user_id: str, question: str, answer: str, difficulty: str, is_correct: bool):
        """Save a single interaction to the user's progress file"""
        user_file = self.storage_dir / f"{user_id}.json"
        
        # Load existing data or create new
        if user_file.exists():
            with open(user_file, 'r') as f:
                data = json.load(f)
        else:
            data = {
                "user_id": user_id,
                "total_questions": 0,
                "correct_answers": 0,
                "difficulty_stats": {"easy": 0, "medium": 0, "hard": 0},
                "correct_by_difficulty": {"easy": 0, "medium": 0, "hard": 0},
                "interactions": []
            }
        
        # Update statistics
        data["total_questions"] += 1
        if is_correct:
            data["correct_answers"] += 1
            data["correct_by_difficulty"][difficulty] += 1
        data["difficulty_stats"][difficulty] += 1
        
        # Add new interaction
        data["interactions"].append({
            "timestamp": datetime.now().isoformat(),
            "question": question,
            "answer": answer,
            "difficulty": difficulty,
            "is_correct": is_correct
        })
        
        # Save updated data
        with open(user_file, 'w') as f:
            json.dump(data, f, indent=2)
            
    def get_progress(self, user_id: str) -> Dict:
        """Get the user's progress statistics"""
        user_file = self.storage_dir / f"{user_id}.json"
        if not user_file.exists():
            return {
                "total_questions": 0,
                "correct_answers": 0,
                "accuracy": 0,
                "difficulty_breakdown": {"easy": 0, "medium": 0, "hard": 0},
                "accuracy_by_difficulty": {"easy": 0, "medium": 0, "hard": 0}
            }
            
        with open(user_file, 'r') as f:
            data = json.load(f)
            
        accuracy = (data["correct_answers"] / data["total_questions"] * 100) if data["total_questions"] > 0 else 0
        accuracy_by_difficulty = {}
        for diff in ["easy", "medium", "hard"]:
            total = data["difficulty_stats"][diff]
            correct = data["correct_by_difficulty"][diff]
            accuracy_by_difficulty[diff] = (correct / total * 100) if total > 0 else 0
            
        return {
            "total_questions": data["total_questions"],
            "correct_answers": data["correct_answers"],
            "accuracy": accuracy,
            "difficulty_breakdown": data["difficulty_stats"],
            "accuracy_by_difficulty": accuracy_by_difficulty
        }

    def get_recent_interactions(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get the user's most recent interactions"""
        user_file = self.storage_dir / f"{user_id}.json"
        if not user_file.exists():
            return []
            
        with open(user_file, 'r') as f:
            data = json.load(f)
            
        return data["interactions"][-limit:] 