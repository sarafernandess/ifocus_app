# src/validators.py

def validate_non_empty_string(value: str, field_name: str):
    if not value:
        raise ValueError(f"{field_name} não pode estar vazio")


def validate_positive_integer(value: int, field_name: str):
    if value <= 0:
        raise ValueError(f"{field_name} deve ser um número positivo")
