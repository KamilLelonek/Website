lock '3.2.1'

set :application, 'website'
set :repo_url,    'git@github.com:KamilLelonek/Website.git'
set :deploy_to,   '/var/www/lelonek.me'
set :user,        'website'
set :deploy_via,  :remote_cache
set :use_sudo,    true

namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:web) do
      sudo '/etc/init.d/nginx restart'
    end
  end

  after :publishing, :restart
end
