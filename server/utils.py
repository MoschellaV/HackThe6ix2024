def check_string_length(input_string, max_length):
    if len(input_string) > max_length:
        raise ValueError(f"The input string is too long. It should be no more than {max_length} characters.")