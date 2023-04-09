from django.db import models
from django.contrib.auth import get_user_model


class Todo(models.Model):
    # This field will store the title of the task, with a maximum length of 50 characters.
    title = models.CharField(max_length=50)
    # This field will store a positive integer, with a default value of 0.
    some_number = models.PositiveIntegerField(default=0)
    # This field will store the string representation of some_number, with a maximum length of 12 characters.
    some_number_string = models.CharField(max_length=12)
    # This field will store the description of the task, with a default value of an empty string.
    description = models.TextField(blank=True)
    # This field will store the datetime when the task was created, with the default value being the time when it was added.
    created_at = models.DateTimeField(auto_now_add=True)
    # This field will store the user who posted the task, with a foreign key to the User model and a null value allowed.
    posted_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        # This method is being overridden to automatically convert some_number to some_number_string when the model is saved.
        if self.some_number:
            self.some_number_string=str(self.some_number)
        super(Todo, self).save(*args, **kwargs)

class Action(models.Model):
    # This field will store the user who performed the action, with a foreign key to the User model and a null value allowed.
    user = models.ForeignKey(get_user_model(),related_name="actionSet", null=True, on_delete=models.CASCADE)
    # This field will store the task for which the action is being performed, with a foreign key to the Todo model.
    todo = models.ForeignKey(Todo, related_name="actions", on_delete=models.CASCADE)