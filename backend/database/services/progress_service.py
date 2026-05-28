from sqlalchemy.orm import Session
from database.models.progress_model import Progress
from database.services.mentor_service import (
    calculate_level,
    generate_insights
)


def get_or_create_user(db: Session, username: str):

    user = db.query(Progress).filter(
        Progress.username == username
    ).first()

    if not user:

        user=Progress(username=username)

        db.add(user)
        db.commit()
        db.refresh(user)

    return user


def update_skills(
    db,
    user,
    anatomy,
    shading,
    perspective,
    composition,
    line_confidence
):

    user.anatomy += anatomy
    user.shading += shading
    user.perspective += perspective
    user.composition += composition
    user.line_confidence += line_confidence

    user.streak += 1

    user.level = calculate_level(user)

    db.commit()