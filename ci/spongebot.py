#!/usr/bin/env python3

# This script defines useful functionality for Spongebot.

from __future__ import print_function
import random

def parse_deploy_directory_name(deploy_directory_name):
    """Parses the name of a deploy directory as a pull request number.
       Returns None if the deploy directory name does not identify
       a pull request."""
    prefix = 'pull-request-'
    if deploy_directory_name.startswith(prefix):
        try:
            return int(deploy_directory_name[len(prefix):])
        except ValueError:
            return None
    else:
        return None

def has_commented_on_pull_request(pull_request):
    """Tells if Dubious Spongebot has commented on a pull request."""
    for comment in pull_request.get_issue_comments():
        if comment.user.login == 'dubious-spongebot':
            return True
    return False

# Spongebot Squarepants' greetings.
SALUTATIONS = [
    """Oh hi there {0}!""",
    """I did not hit her, it's not true! It's bullshit! I did not hit her! *I did naaaahht.* Oh hi {0}.""",
    """Oh hi {0}. I didn't know it was you.""",
    """Ha ha ha. What a story, {0}."""
]

# Things Spongebot Squarepants may say to bid you farewell.
VALEDICTIONS = [
    """Thanks for contributing! Keep up the good work and have a wonderful day!""",
    """You're my favorite customer. Buh-bye.""",
    """This is a beautiful pull request! You included all the code. Good thinking!""",
    """You think about everything. Ha ha ha."""
]

def generate_pull_request_deployed_comment(pull_request, deploy_directory_name):
    """Generates the body of the comment that is posted when a pull request
       has been deployed to GitHub pages."""
    salutation = random.choice(SALUTATIONS).format('@' + pull_request.user.login)
    valediction = random.choice(VALEDICTIONS)

    message_format = """{0}

I built and deployed your pull request. 🎉🎆🎉
You can try it out [here](https://dubious-developments.github.io/{1}/index.html).
If you're looking for the coverage report, that's [right here](https://dubious-developments.github.io/{1}/coverage/index.html).

{2}

> **Note:** it may take a little while before GitHub pages gets updated. Try again in a minute if your deployed build doesn't show up right away."""

    return message_format.format(salutation, deploy_directory_name, valediction)

def create_pull_request_deployed_comment(pull_request, deploy_directory_name):
    """Adds an issue comment to a pull request that links to the deployed build."""
    pull_request.create_issue_comment(
        generate_pull_request_deployed_comment(
            pull_request,
            deploy_directory_name))
