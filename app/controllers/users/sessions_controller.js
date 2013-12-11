load('application');

action('new', function() {
  if(currentUser) {
    redirect(pathTo.root);
  }
  render();
});