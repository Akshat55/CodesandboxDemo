/**
 * Returns a path string for a straight path
 * @param  {Object} source - The source coordinates
 * @param  {Number} source.x - The source's x coordinate
 * @param  {Number} source.y - The source's y coordinate
 * @param  {Object} target - The target coordinates
 * @param  {Number} target.x - The target's x coordinate
 * @param  {Number} target.y - The target's y coordinate
 * @return {String} The path string
 */
declare const buildStraightPathString: (source: any, target: any) => string;
/**
 * Returns a path string for an elbow path with a bend point
 * @param  {Object} source - The source coordinates
 * @param  {Number} source.x - The source's x coordinate
 * @param  {Number} source.y - The source's y coordinate
 * @param  {Object} target - The target coordinates
 * @param  {Number} target.x - The target's x coordinate
 * @param  {Number} target.y - The target's y coordinate
 * @param  {Number} percent - Where the bend point should appear between the source and target
 * @return {String} The path string
 */
declare const buildElbowPathString: (source: any, target: any, percent?: number) => string;
/**
 * Returns a path string for an path with a custom bezier curve
 * @param  {Object} source - The source coordinates
 * @param  {Number} source.x - The source's x coordinate
 * @param  {Number} source.y - The source's y coordinate
 * @param  {Object} target - The target coordinates
 * @param  {Number} target.x - The target's x coordinate
 * @param  {Number} target.y - The target's y coordinate
 * @param  {Number} cpx1 - X coordinate for the first control point
 * @param  {Number} cpy1 - Y coordinate for the first control point
 * @param  {Number} cpx2 - X coordinate for the second control point
 * @param  {Number} cpy1 - Y coordinate for the second control point
 * @return {String} The path string
 */
declare const buildBezierPathString: (source: any, target: any, cpx1: any, cpy1: any, cpx2: any, cpy2: any) => string;
export { buildStraightPathString, buildElbowPathString, buildBezierPathString };
