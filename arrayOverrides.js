// These functions provide additional specific functionality for arrays
// They are specialized so not useful for general use.


/*
 * matchingElement() - Determines the counter value of a cell in the main list.
 * If no match found, returns -1
 * takes a single array argument that should contain the [x,y] coordinates
 * of the proposed cell
 * 
 */
if (!Array.prototype.matchingElement) {
		Array.prototype.matchingElement = function(pos) {
			var result = -2;
			this.forEach(function(item) {
				if (pos[0] == item[0] && pos[1] == item[1]) {
					result = item[2];
				}
			});
		return parseInt(result);
		}
	}

