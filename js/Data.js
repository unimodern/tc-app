class Data {
    data = [];
    dim = 0;
    after = '';
    apply = true;
    info = true;
    // const PREPOSITIONS='a,abaft,aboard,about,above,absent,across,afore,after,against,along,alongside,amid,amidst,among,amongst,an,anenst,apropos,apud,around,as,aside,astride,at,athwart,atop,barring,before,behind,below,beneath,beside,besides,between,beyond,but,by,circa,concerning,despite,down,during,except,excluding,failing,following,for,forenenst,from,given,in,including,inside,into,lest,like,mid,midst,minus,modulo,near,next,notwithstanding,of,off,on,onto,opposite,out,outside,over,pace,past,per,plus,pro,qua,regarding,round,sans,save,since,than,through,thru,throughout,thruout,till,times,to,toward,towards,under,underneath,unlike,until,unto,up,upon,versus,via,vice,with,within,without,worth';
    // const PREPOSITIONS_THREE_LETTERS_OR_LESS='a,an,as,at,but,by,for,in,mid,of,off,on,out,per,pro,qua,to,up,via';
    // const PREPOSITIONS_FIVE_LETTERS_OR_LESS='a,abaft,about,above,afore,after,along,amid,among,an,apud,as,aside,at,atop,below,but,by,circa,down,for,from,given,in,into,lest,like,mid,midst,minus,near,next,of,off,on,onto,out,over,pace,past,per,plus,pro,qua,round,sans,save,since,than,thru,till,times,to,under,until,unto,up,upon,via,vice,with,worth';
    // const ARTICLES='a,an,the';
    // const CONJUNCTIONS='for,and,nor,but,or,yet,so';

    dimUp(needles) {
        let arra = [];
        switch (this.dim) {
            case 0:
                return {
                    'result': 0,
                    'message': 'dim is zero.',
                };
            case 1:
                let message = '';
                let data = this.data[0];
                arra = [];
                let reminder = '';
                let cut = true;
                if (needles.includes('')) return {
                    'result': 0,
                    'message': 'empty needle not acceptable.',
                };
                while (data.length > 0) {
                    let shouldSkip = false;
                    needles.forEach((needle) => {
                        if (shouldSkip) {
                            return;
                        }
                        message += "Checking: <" + data.substr(0, needle.length) + "> for <" + needle + ">\n"
                        if (data.substr(0, needle.length) == needle) {
                            let found = new Data;
                            found.after = needle;
                            found.dim = 1;
                            found.data = [reminder];
                            arra.push(found);
                            reminder = '';
                            data = data.substr(needle.length);
                            message += 'reminder:<' + reminder +
                                '> needle=<' + needle +
                                '> - data:<' + data +
                                '> --\n';
                            cut = false;
                            shouldSkip = true;
                            return;
                        }
                    })
                    if (cut) {
                        reminder += data[0];
                        data = data.substr(1);
                        message +=' ++++ reminder:<'+reminder+'> - data:<'+data+'> ------\n';
                    }
                    cut = true;
                }
                if (reminder) {
                    let found = new Data;
                    found.after = '';
                    found.dim = 1;
                    found.data = [reminder];
                    arra.push(found);
                }
                //arra['message']=message;
                this.data = arra;
                this.dim++;
                return {
                    'result': 0,
                    'message': message,
                };

            default:
                arra = [];
                this.data.forEach((data) => {
                    data.dimUp(needles);
                    arra.push(data);
                })
                this.data = arra;
                this.dim++;
                break;
        }

    }

    dimDown() {
        let dim = this.dim;
        switch (dim) {
            case 0:
                return {
                    'result': 0,
                    'message': 'dim is zero.',
                };
            case 1:
                return {
                    'result': 0,
                    'message': 'dim is one.',
                };
            case 2:
                let d = '';
                this.data.forEach((data) => {
                    d += data.data[0]+data.after;
                })
                this.data = [d];
                this.dim--;
                break;
            default:
                let arra = [];
                this.data.forEach((data) => {
                    data.dimDown();
                    arra.push(data);
                })
                this.data = arra;
                this.dim--;
        }
    }
    toArray() {
        let dim = this.dim;
        switch (dim) {
            case 0:
                return {
                    'result': 0,
                    'message': 'dim is zero.',
                };
            case 1:
                return [this.apply ? this.data[0] : ''];

            default:
                let d = [];
                this.data.forEach((data) => {
                    if (this.apply)
                        d = d.concat(data.toArray());
                })
                return d;
        }
    }
}
module.exports = Data 