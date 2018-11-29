const copyToClipboard = (id: string) => {
  const text: any = document.getElementById(id);
  text.select();
  document.execCommand('copy');
  text.blur();
};

export default copyToClipboard;
