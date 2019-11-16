////////////////  HTML FUNCTINS ////////////////////

/**
 * Render a label for a input elemennt.
 *
 * @param string Label to add.
 * @param string Input id to refer.
 * @param string Input type of the element. The id of the elements using print_* functions add a prefix, this
 * variable helps with that. Values: text, password, textarea, button, submit, hidden, select. Default: text.
 * @param bool Whether to return an output string or echo now (optional, echo by default).
 * @param string Extra HTML to add after the label.
 */
function print_label (label, id, input_type = 'text', thereturn = false, html = false) {
	output = '';

	switch (input_type) {
	case 'text':
		$id = 'text-'+ id;
		break;
	case 'password':
		$id = 'password-' + id;
		break;
	case 'textarea':
		$id = 'textarea-'+ id;
		break;
	case 'button':
		$id = 'button-'+ id;
		break;
	case 'submit':
		$id = 'submit-'+ id;
		break;
	case 'hidden':
		$id = 'hidden-'+ id;
		break;
	case 'checkbox':
		$id = 'checkbox-'+ id;
		break;
	case 'file':
		$id = 'file-'+ id;
		break;
	case 'image':
		$id = 'image-'+ id;
		break;
	case 'select':
	default:
		break;
	}

	output += '<label id="label-'+ id + '" for="'+ id +'">';
	output += label;
	output += '</label>';

	if (html)
		output += html;

	if (thereturn)
		return output;

	console.log(output);
}


/**
 * Prints an array of fields in a popup menu of a form.
 *
 * Based on choose_from_menu() from Moodle
 *
 * $fields Array with dropdown values. Example: $fields["value"] = "label"
 * $name Select form name
 * $selected Current selected value.
 * $script Javascript onChange code.
 * $nothing Label when nothing is selected.
 * $nothing_value Value when nothing is selected
 */

function print_select (fields, name, selected = '', script = '', nothing = 'select', nothing_value = '0', thereturn = false, multiple = 0, sort = true, label = false, disabled = false, style='') {

  //for(var value in fields) {
    //console.log("PRINT_SELECT: " + value + " - Value: " + fields[value]);
  //}

	var output = "\n";
    let disabledText;

	if (label) {
		output += print_label (label, name, 'select', true);
	}

	var attributes = (script) ? 'onchange="'+ script + '"' : '';
	if (multiple) {
		attributes += ' multiple="yes" size="' + multiple + '" ';
	}

	if (disabled) {
		disabledText = 'disabled';
	}
	else {
		disabledText = '';
	}

	if (style == "")
		output += '<select style="width: 170px" ' + disabledText + ' id="' +name +'" name="' + name +'" ' + attributes +">\n";
	else
		output += '<select style="' + style + '" ' + disabledText + ' id="' +name +'" name="' + name +'" ' +  attributes +">\n";

	if (nothing != '') {
		output += '   <option value="' + nothing_value + '"';
		if (nothing_value == selected) {
			output += " selected";
		}
		output += '>' + nothing + "</option>\n";
	}
    

    //console.log ("KEYS ----------------");
    //console.log(Object.keys(fields));
    //console.log("Lenght: " + Object.keys(fields).length);
    //console.log("Type of:" + typeof fields);
	if (typeof fields !== 'undefined' && Object.keys(fields).length > 0) {
        //if (sort)
            // todo: sort the pair key values
            //fields.sort();
            for(var value in fields) {
              
             
                var label = fields[value];
                var optlabel = label;
                if(label instanceof Array){
                    if(!(typeof lastopttype !== 'undefined') || (label.optgroup != lastopttype)) {
                        if((typeof lastopttype !== 'undefined') && (lastopttype != '')) {
                            output +=  '</optgroup>';
                        }
                        output +=  '<optgroup label="' + label.optgroup + '">';
                        $lastopttype = label.optgroup;
                    }
                    optlabel = label.name;
                }
    
                output += '   <option value="' + value +'"';
               // if (safe_output($value) == safe_output($selected)) {
                if (value == selected) {
                    output += ' selected';
                }
                if (optlabel === '') {
                    output += '>' +value +"</option>\n";
                } else {
                    output += '>'+ optlabel + "</option>\n";
                } 


            }
		
	}

	output += "</select>\n";
	if (thereturn)
		return output;

	console.log(output);
}


const db = require('../config/db.config.js');





/**
 * Prints an array of fields in a popup menu of a form based on a SQL query.
 * The first and second columns of the query will be used.
 *
 * Based on choose_from_menu() from Moodle
 *
 * $sql SQL sentence, the first field will be the identifier of the option.
 *      The second field will be the shown value in the dropdown.
 * $name Select form name
 * $selected Current selected value.
 * $script Javascript onChange code.
 * $nothing Label when nothing is selected.
 * $nothing_value Value when nothing is selected

 return a Promise oject
 You access the result of a promise by using the .then()

 */
async function print_select_from_sql (sql, name, selected = '', script = '', nothing = 'select', nothing_value = '0', thereturn = false, multiple = false, sort = true, label = false, disabled = false) {

	fields = {};
    
  var Result = await db.sequelize.query(sql, {
    type: db.sequelize.QueryTypes.SELECT
  });
      //console.log("The result is: " + JSON.stringify(Result));
      if (typeof Result == 'undefined' || Result.length ==0) {
        console.log( "<H3> ERROR IN QUERY </H3>");
        return "";
      }

      //result is an array of objects [{item},{item},{item}]
      Result.forEach(function(items){
        
        values = Object.values(items);
        //console.log( "*********************************************");
        //  console.log("\n[0]]: " + values[0] );
        //  console.log("\n[1]]: " + values[1] );
        //console.log( "*********************************************");
        fields[values[0]] = values[1];
        }); //end foreach

      //console.log( "*********************************************");
      //console.log("FIELDS: " + JSON.stringify(fields));
      //console.log( "*********************************************");



      output = print_select (fields, name, selected, script, nothing, nothing_value, true, multiple, sort, label, disabled);
      //console.log("SELECT fase 1: " + output);
      
   
  if (thereturn){
    //console.log("SELECT to return: " + output);
    return output;
  }else
  console.log(output);

}

  

module.exports = {
  print_select,
  print_label,
  print_select_from_sql
}