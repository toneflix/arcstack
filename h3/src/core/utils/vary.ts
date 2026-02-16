/*!
 * vary
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
import { H3Event } from "h3";

/**
 * RegExp to match field-name in RFC 7230 sec 3.2
 *
 * field-name    = token
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 */

var FIELD_NAME_REGEXP = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

/**
 * Append a field to a vary header.
 *
 * @param header
 * @param field
 * @return
 * @public
 */
export const append = (header: string, field: string | string[]) => {
  if (typeof header !== "string") {
    throw new TypeError("header argument is required");
  }

  if (!field) {
    throw new TypeError("field argument is required");
  }

  // get fields array
  var fields = !Array.isArray(field) ? parse(String(field)) : field;

  // assert on invalid field names
  for (var j = 0; j < fields.length; j++) {
    if (!FIELD_NAME_REGEXP.test(fields[j])) {
      throw new TypeError("field argument contains an invalid header name");
    }
  }

  // existing, unspecified vary
  if (header === "*") {
    return header;
  }

  // enumerate current values
  var val = header;
  var vals = parse(header.toLowerCase());

  // unspecified vary
  if (fields.indexOf("*") !== -1 || vals.indexOf("*") !== -1) {
    return "*";
  }

  for (var i = 0; i < fields.length; i++) {
    var fld = fields[i].toLowerCase();

    // append value (case-preserving)
    if (vals.indexOf(fld) === -1) {
      vals.push(fld);
      val = val ? val + ", " + fields[i] : fields[i];
    }
  }

  return val;
};

/**
 * Parse a vary header into an array.
 *
 * @param  header
 * @return
 * @private
 */

export const parse = (header: string) => {
  var end = 0;
  var list = [];
  var start = 0;

  // gather tokens
  for (var i = 0, len = header.length; i < len; i++) {
    switch (header.charCodeAt(i)) {
      case 0x20 /*   */:
        if (start === end) {
          start = end = i + 1;
        }
        break;
      case 0x2c /* , */:
        list.push(header.substring(start, end));
        start = end = i + 1;
        break;
      default:
        end = i + 1;
        break;
    }
  }

  // final token
  list.push(header.substring(start, end));

  return list;
};

/**
 * Mark that a request is varied on a header field.
 *
 * @param res
 * @param  field
 * @public
 */

export const vary = (res?: H3Event["res"], field?: string | string[]) => {
  if (!res || !res.headers.get || !res.headers.set) {
    throw new TypeError("res argument is required");
  }

  // get existing header
  let val = res.headers.get("Vary") || "";
  const header = Array.isArray(val) ? val.join(", ") : String(val);

  if (!field) {
    return res.headers.set("Vary", "*");
  }

  // set new header
  if ((val = append(header, field))) {
    res.headers.set("Vary", val);
  }
};
