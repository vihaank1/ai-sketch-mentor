def calculate_level(user):

    average = (
        user.anatomy +
        user.shading +
        user.perspective + 
        user.composition +
        user.line_confidence 
    ) / 5

    if average < 200:
        return "beginner"
    
    elif average < 400:
        return "intermediate"
    
    else:
        return "advanced"
    

def generate_insights(user):

    insights = []

    weakest = min([
        ("anatomy", user.anatomy),
        ("shading", user.shading),
        ("perspective", user.perspective),
        ("composition", user.composition),
        ("line confidence", user.line_confidence)
    ], key=lambda x: x[1])

    strongest = max([
        ("anatomy", user.anatomy),
        ("shading", user.shading),
        ("perspective", user.perspective),
        ("composition", user.composition),
        ("line confidence", user.line_confidence)
    ], key=lambda x: x[1])

    insights.append(
        f"You strongest skill is currently {strongest[0]}."
    )

    insights.append(
        f"You strongest skill is currently {weakest[0]}."
    )

    return insights