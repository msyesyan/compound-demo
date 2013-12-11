load('application');

action('new', function() {
  if(currentUser) {
    redirect(pathTo.root);
  }
  render();
});

action('destroy', function() {
  delete session.passport.user
  redirect(pathTo.root);
})