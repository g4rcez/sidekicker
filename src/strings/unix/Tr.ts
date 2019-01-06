interface TR {
  text: string;
  subs1: string;
  subs2: string;
}

const Tr = (tr: TR) => {
  let text = [...tr.text];
  if (tr.subs1.length === tr.subs2.length) {
    [...tr.subs1].forEach((x, i) => {
      if (text.indexOf(x) !== tr.text.search(x)) {
        text[text.indexOf(x)] = tr.subs2[i];
      } else {
        text[tr.text.search(x)] = tr.subs2[i];
      }
    });
    return text.join('');
  }
  return tr.text;
};

export default Tr;
