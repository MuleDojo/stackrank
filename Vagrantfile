# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "forwarded_port", guest: 27017, host: 27017
  config.vm.network "private_network", type: "dhcp"
  config.vm.provision :shell, :path => "./misc/bootstrap.sh"
end
