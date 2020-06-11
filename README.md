# `random-uint-below`

## Usage

    import {randomUIntBelow} from "random-uint-below"

    `randomUIntBelow(max)` returns a random non-negative integer less than max `(0 <= output < max)`. `max` must be at most 2^53.

    randomUIntBelow(4); // Generates a uniform random value from [0, 1, 2, 3].

Since one of the most comon use cases for this is to select a random element from an array, we also provide a convenience:

    import {randomChoice} from "random-uint-below"

    randomChoice(["vanilla", "strawberry", "peppermint"])

## License

MIT or GPL.
