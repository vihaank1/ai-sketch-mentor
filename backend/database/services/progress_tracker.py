progress_db = {}

def update_progress(user_id, progress):

    if user_id not in progress_db:
        progress_db[user_id] = {
            "history": [],
            "current": {
                "anatomy": 0,
                "shading": 0,
                "perspective": 0,
                "composition": 0,
                "line_confidence": 0,
                "streak": 0
            }
        }


    progress_db[user_id]["history"].append(progress)
    progress_db[user_id]["current"] = progress

    return progress_db[user_id]