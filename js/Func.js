class Func {
    name = '';
    inputs = [];
    options = {
        'set': true,
        'only end-nodes': true,
        'ignore empty entries': true,
        'on after too': true,
        'first': false,
        'last': false,
        'after': -1,
        'before': -1,
        'larger than': -1,
        'smaller than': -1,
        'words': [],
        'modifiers': [],
        'error': '',
        'case': 'upper',
    };
    apply(ins = []) {
        let inputs = (ins ? ins : this.inputs);
        inputs = (Array.isArray(inputs) ? inputs : [inputs]);
        let output = [];
        console.log("apply:"+this.name);
        console.log("inputs:"+JSON.stringify(inputs));
        switch (this.name) {
            case 'output':
                return inputs;
            case 'apply': //inputs is an array of Data
                output = [];
                inputs.forEach((input) => {
                    switch (input.dim) {
                        case 0:
                        case 1:
                            input.apply = this.options['set'];
                            output.push(input);
                            break;
                        default:
                            const data = this.apply(input.data);
                            input.data = Array.isArray(data) ? data : [data];
                            if (!this.options['only end-nodes']) input.apply = this.options['set'];
                            output.push(input);
                    }
                });
                console.log("output:"+JSON.stringify(output));
                return (inputs.length > 1 ? output : output[0]);
            case 'apply element': //inputs is an array of Data
                output = [];
                const first = this.options['positions'].includes('first');
                const middle = this.options['positions'].includes('middle');
                const last = this.options['positions'].includes('last');
                const ignore = this.options['ignore empty entries'];
                inputs.forEach((input) => {
                    switch (input.dim) {
                        case 0:
                        case 1:
                            input.apply = this.options['set'];
                            output.push(input);
                            break;
                        case 2:
                            if (first)
                                if (ignore) {
                                    const i = 0;
                                    while ((input.data[i].data[0]) && !input.data[i].data[0]) 
                                        i++;
                                    input.data[i].apply = this.options['set'];
                                } else {
                                    input.data[0].apply = this.options['set'];
                                }
                            if (last)
                                if (ignore) {
                                    const i = input.data.length - 1;
                                    while (i >= 0 && !input.data[i].data[0]) i--;
                                    if (i >= 0 && (input.data.includes(i))) input.data[i].apply = this.options['set'];
                                } else {
                                    input.data[input.data.length - 1].apply = this.options['set'];
                                }
                            if (middle)
                                if (ignore) {
                                    i = input.data.length - 1;
                                    while (!input.data[i].data[0]) i--;
                                    j = 0;
                                    while (!input.data[i].data[0]) j++;
                                    for (k = j + 1; k < i; k++)
                                        input.data[k].apply = this.options['set'];
                                } else {
                                    for (k = 1; k < input.data.length - 1; k++)
                                        input.data[k].apply = this.options['set'];
                                }
                            if (this.options['last']) input.data[input.data.length - 1].apply = this.options['set'];
                            output.push(input);
                            break;
                        default:
                            const data = this.apply(input.data);
                            input.data = Array.isArray(data) ? data : [data];
                            if (!this.options['only end-nodes']) {
                                if (this.options['first']) input.data[0].apply = this.options['set'];
                                if (this.options['last']) input.data[input.data.length - 1].apply = this.options['set'];
                            }
                            output.push(input);
                    }
                });
                console.log("output:"+JSON.stringify(output));
                return (inputs.length > 1 ? output : output[0]);
            case 'apply size': //inputs is an array of Data
                output = [];
                inputs.forEach((input) => {
                    switch (input.dim) {
                        case 0:
                        case 1:
                            if (input.data[0].length > this.options['larger than']) 
                                input.apply = this.options['set'];
                            if (input.data[0].length < this.options['smaller than']) 
                                input.apply = this.options['set'];
                            output.push(input);
                            break;
                        default:
                            const data = this.apply(input.data);
                            input.data = Array.isArray(data) ? data : array(data);
                            output.push(input);
                    }
                });
                return (inputs.length > 1 ? output : output[0]);

            case 'apply word': //inputs is an array of Data
                output = [];
                inputs.forEach((input) => {
                    switch (input.dim) {
                        case 0:
                        case 1:
                            if (this.options['words'].includes(input.data[0].toLowerCase())) input.apply = this.options['set'];
                            output.push(input);
                            break;
                        default:
                            if (input.data.length > 0) {
                                const data = this.apply(input.data);
                                input.data = Array.isArray(data) ? data : [data];
                            }
                            output.push(input);
                    }
                });
                console.log("output:"+JSON.stringify(output));
                return (inputs.length > 1 ? output : output[0]);

            case 'apply word case sensitive': //inputs is an array of Data
                output = [];
                
                inputs.forEach((input) => {
                    switch (input.dim) {
                        case 0:
                        case 1:
                            if (input.data[0] in this.options['words']) input.apply = this.options['set'];
                            output.push(input);
                            break;
                        default:
                            if (input.data.length > 0) {
                                const data = this.apply(input.data);
                                input.data = Array.isArray(data) ? data : [data];
                            }
                            output.push(input);
                    }
                })
                return (inputs.length > 1 ? output : output[0]);

            case 'uppercase': //inputs is an array of Data
                return this.apply_php(inputs, "mb_strtoupper");

            case 'lowercase': //inputs is an array of Data
                return this.apply_php(inputs, "mb_strtolower");

            case 'first letter uppercase': //inputs is an array of Data
                return this.apply_php(inputs, 'this.mb_ucfirst');

            case 'first letter lowercase': //inputs is an array of Data
                return this.apply_php(inputs, 'this.mb_lcfirst');

            case 'regex': //inputs is an array of Data
                return this.apply_regex(inputs);

            case 'ireplace': //inputs is an array of Data
                return this.apply_ireplace(inputs);

            case 'first letter case': //inputs is an array of Data
                if (this.options['case'] == 'upper') {
                    return this.apply_php(inputs, 'this.mb_ucfirst');
                } else {
                    return this.apply_php(inputs, 'this.mb_lcfirst');
                }

            case 'case': //inputs is an array of Data
                if (this.options['case'] == 'upper') {
                    return this.apply_php(inputs, "mb_strtoupper");
                } else {
                    return this.apply_php(inputs, "mb_strtolower");
                }

            case 'dim up': //inputs is an array of Data
                output = [];
                inputs.forEach((input) => {
                    if ('words' in this.options) input.dimUp(this.options['words']);
                    output.push(input);
                });
                return (inputs.length > 1 ? output : output[0]);
            case 'dim down': //inputs is an array of Data
                output = [];
                inputs.forEach((input) => {
                    input.dimDown();
                    output.push(input);
                });
                return (inputs.length > 1 ? output : output[0]);
            case 'apply size': //inputs is an array of Data
                output = [];
                inputs.forEach((input) => {
                    switch (input.dim) {
                        case 0:
                        case 1:
                            if (input.data[0].length > this.options['larger than'])
                                input.apply = this.options['set'];
                            if (input.data[0].length < this.options['smaller than'])
                                input.apply = this.options['set'];
                            output.push(input);
                            break;
                        default:
                            data = this.apply(input.data);
                            input.data = Array.isArray(data) ? data : [data];
                            output.push(input);
                    }
                });
                return (inputs.length > 1 ? output : output[0]);

            case 'apply word': //inputs is an array of Data
                output = [];
                
                inputs.forEach((input) => {
                    switch (input.dim) {
                        case 0:
                        case 1:
                            if (this.options['words'] in strtolower(input.data[0]))
                                input.apply = this.options['set'];
                            output.push(input);
                            break;
                        default:
                            if (input.data.length) {
                                data = this.apply(input.data);
                                input.data = Array.isArray(data) ? data : [data];
                            }
                            output.push(input);
                    }
                })
                return (inputs.length > 1 ? output : output[0]);

            case 'apply word case sensitive': //inputs is an array of Data
                output = [];
                
                inputs.forEach((input) => {
                    switch (input.dim) {
                        case 0:
                        case 1:
                            if (this.options['words'] in input.data[0])
                                input.apply = this.options['set'];
                            output.push(input);
                            break;
                        default:
                            if (input.data.length) {
                                data = this.apply(input.data);
                                input.data = Array.isArray(data) ? data : [data];
                            }
                            output.push(input);
                    }
                })
                return (inputs.length > 1 ? output : output[0]);

            case 'uppercase': //inputs is an array of Data
                return this.apply_php(inputs, "mb_strtoupper");

            case 'lowercase': //inputs is an array of Data
                return this.apply_php(inputs, "mb_strtolower");

            case 'first letter uppercase': //inputs is an array of Data
                return this.apply_php(inputs, 'this.mb_ucfirst');

            case 'first letter lowercase': //inputs is an array of Data
                return this.apply_php(inputs, 'this.mb_lcfirst');

            case 'regex': //inputs is an array of Data
                return this.apply_regex(inputs);

            case 'ireplace': //inputs is an array of Data
                return this.apply_ireplace(inputs);

            case 'first letter case': //inputs is an array of Data
                if (this.options['case'] == 'upper') {
                    return this.apply_php(inputs, 'this.mb_ucfirst');
                } else {
                    return this.apply_php(inputs, 'this.mb_lcfirst');
                }
                break;
            case 'case': //inputs is an array of Data
                if (this.options['case'] == 'upper') {
                    return this.apply_php(inputs, "mb_strtoupper");
                } else {
                    return this.apply_php(inputs, "mb_strtolower");
                }
                break;
            case 'dim up': //inputs is an array of Data
                output = [];
                inputs.forEach((input) => {
                    if ('words' in this.options)
                        input.dimUp(this.options['words']);
                    output.push(input);
                })
                return (inputs.length > 1 ? output : output[0]);

            case 'dim down': //inputs is an array of Data
                output = [];
                inputs.forEach((input) => {
                    input.dimDown();
                    output.push(input);
                })
                return (inputs.length > 1 ? output : output[0]);

        }
    }
    apply_php(inputs, str) {
        inputs = (Array.isArray(inputs) ? inputs : [inputs]);
        //$this->error.=print_r(inputs,true);
        const output = [];
        inputs.forEach((input) => {
            switch (input.dim) {
                case 0:
                case 1:
                    if (input.apply && input.data.length) eval('input.data[0]=' + str + '(input.data[0]);');
                    if ((['on after too'] in this.options) && this.options['on after too'] && input.apply) eval('input.after=' + str + '(input.after);');
                    output.push(input);
                    break;
                default:
                    if (input.apply && input.data.length) {
                        const data = this.apply(input.data);
                        input.data = Array.isArray(data) ? data : [data];
                    }
                    if ((['on after too'] in this.options) && this.options['on after too'] && input.apply) eval('input.after=' + str + '(input.after);');
                    output.push(input);
            }
        })
        return (inputs.length > 1 ? output : output[0]);
    }

    apply_regex(inputs) {
        inputs = (Array.isArray(inputs) ? inputs : [inputs]);
        const modifiers = ('modifiers' in this.options) ? this.options['modifiers'].join('') : '';
        const find = this.options['find'];
        const replace = this.options['replace'];
        const output = [];
        inputs.forEach((input) => {
            switch (input.dim) {
                case 0:
                case 1:
                    if (input.apply) {
                        const re = new RegExp(find, modifiers);
                        input.data[0]=input.data[0].replace(re,replace);
                    }
                    if ((['on after too'] in this.options) && this.options['on after too'] && input.apply) {
                        const re = new RegExp(find, modifiers);
                        input.after = input.after.replace(re, replace)
                    }
                    output.push(input);
                    break;
                default:
                    if (input.apply) {
                        $data = this.apply(input.data);
                        input.data = Array.isArray(data) ? data : [data];
                    }
                    if ((['on after too'] in this.options) && this.options['on after too'] && input.apply) {
                        const re = new RegExp(find, modifiers);
                        input.after = input.after.replace(re, replace)
                    }
                    output.push(input);
            }
        });
        return (inputs.length > 1 ? output : output[0]);
    }
    apply_ireplace(inputs) {
        inputs = (Array.isArray(inputs) ? inputs : [inputs]);
        // console.log("ireplace", inputs);
        const find = this.options['find'];
        const replace = this.options['replace'];
        let output = [];
        inputs.forEach((input) => {
            switch (input.dim) {
                case 0:
                case 1:
                    if (input.apply) {
                        // input.data[0] = str_ireplace(find, replace, input.data[0]);
                        find.forEach( (tag, i) => input.data[0] = input.data[0].replace(new RegExp(tag, "gi"), replace[i]) )
                    }
                    output.push(input);
                    break;
                default:
                    if (input.apply) {
                        const data = this.apply(input.data);
                        input.data = Array.isArray(data) ? data : [data];
                    }
                    output.push(input);
            }
        })
        return (inputs.length > 1 ? output : output[0]);
    }

    mb_ucfirst(s, $encoding = 'UTF-8') {
        if (typeof s !== 'string') return s
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    mb_lcfirst(s, $encoding = 'UTF-8') {
        if (typeof s !== 'string') return s
        return s.charAt(0).toLowerCase() + s.slice(1)
    }
    stats(text) {
        return {
            "charactersWithSpace": text.length,
            "charactersWithoutSpace": text.replace(/\s/g, "").length,
            "Periods": text.replace(/[^\.]/g, "").length,
            "Commas": text.replace(/[^,]/g, "").length,
        }
    }


}

const mb_strtolower = (str) => {
    return str.toLowerCase()
}
const mb_strtoupper = (str) => {
    return str.toUpperCase()
}
module.exports = Func 