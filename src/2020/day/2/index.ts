/**
 * Advent of Code Day 2.
 *
 * Really explicit documentation since I am using this to help teach my friends.
 */

// This is just saying I'm going to have objects with these properties.
interface PasswordCheck {
  min: number, max: number, query: string, password: string,
}

const PASSWORD_CHECK_REGEX = /(\d*)-(\d*) (\s): (\s+)/g;

function lineToPasswordCheck(line: string): PasswordCheck|null {
  // Use the regex above to extract the values from a line.
  // the parenthesized sections denote the specific values that will
  // be returned in the resultant list:
  //
  // [inputString, firstGroup, secondGroup, thirdGroup, fourthGroup]
  const extractedValues = PASSWORD_CHECK_REGEX.exec(line);

  // This is shorthand in JS/TS. All values kinda act like true or false
  // in which we call them truthy or falsey.
  //
  // 0, '', null, undefined, false would cause this if check to be false
  // most other things would be true denoting that the operation above was
  // a success
  if (extractedValues) {
    // This is new language magic called destructuring.
    // We know that the result will be a an Array of strings so this
    // names the values we want from that array all in one line.
    const [_, min, max, query, password] = extractedValues;

    // query and password are using shorthand here since the variables
    // are the same name as the properties in the object.
    //
    // its the same as {
    //   query: query
    // }
    return {
      min: parseInt(min),
      max: parseInt(max),
      query,
      password,
    };
  }
  return null;
}

// Part 1
// this parameter is is a single parameter but I am destructuring the object
// so I dont have to access it off of a named value:
// `passwordCheck.password` is now just `password`
function evaluatePassword({min, max, query, password}: PasswordCheck): boolean {
  const count = password.split('').reduce(
      (count, char) => query === char ? count + 1 : count, 0);
  return min <= count && count <= max;
}

// This is an example of a programming paradigm called
// functional programming. We actually use the functions themselves as values.
// For example: .map takes a function that accepts the type of the elements in
// the list and returns a new type. After that the list is a list of the type
// that the function takes in.
//
// Array<InputType>.map<OutputType>(fun: function(elementInList: InputType) =>
// OutputType): Array<OutputType>
//
// Array<InputType>: an array containing InputType elements.
//
// .map<OutputType>: a function that is generic to whatever output type is used
// by the param
//
// fun: the function we are giving to map.
// function(elementInList: InputType)=>OutputType: the function that is going to
// be operated on every element in the list
//
// Array<OutputType>: Since all of the elements of the
// original list were evaluated by the function, we now have an array of the
// results of those function calls.
function countValidPasswords(lines: Array<string>): number {
  const passwordsToCheck: Array<PasswordCheck> =
      lines
          .map(lineToPasswordCheck)  // Does a conversion on each line and now
                                     // we have an array of PasswordChecks

          // I havent finished the statement so this is a function call on the
          // output of the line above. Remove all of the null values from the
          // list
          .filter(p => p !== null) as
      Array<PasswordCheck>;  // TS isn't smart enough to know there shouldn't be
                             // nulls anymore so I have to say it manually.

  // Check each password by having map call the evaluate function on each.
  return passwordsToCheck
      .map(evaluatePassword)
      // since the result from the prior call is an array of booleans, we can
      // simply use filter on the booleans where we just pass a function that
      // returns the true or false value. if it's false, filter will make the
      // element not appear in the result.
      .filter(b => b)
      // Now we have all the true passwords. just use the array length as the
      // count
      .length;
}

// Part 2: Later

// Ugly old code
// function*
//     extractValues(input: string): Generator<[number, number, string,
//     string]> {
//   const regex = /(\d*)-(\d*) (.): (.*)/g;
//   let found;
//   do {
//     found = regex.exec(input);
//     if (found) {
//       const [_, min, max, query, line] = found;
//       yield [parseInt(min), parseInt(max), query, line];
//     }
//   } while (found);
// }

// function day2(input: string) {
//   const evaluateLine =
//       (min: number, max: number, query: string, line: string) => {
//         let count = 0;
//         for (const c of line) {
//           count = c === query ? count + 1 : count;
//         }
//         return min <= count && count <= max;
//       };
//   let count = 0;
//   for (const args of extractValues(input)) {
//     count = evaluateLine(...args) ? count + 1 : count;
//   }
//   console.log(count);
// }

// function day2part2(input: string) {
//   const evaluateLine =
//       (first: number, second: number, query: string, line: string) => {
//         return line.charAt(first - 1) === query ?
//             line.charAt(second - 1) !== query :
//             line.charAt(second - 1) === query;
//       };
//   let count = 0
//   for (const args of extractValues(input)) {
//     count = evaluateLine(...args) ? count + 1 : count;
//   }
//   console.log(count);
// }
