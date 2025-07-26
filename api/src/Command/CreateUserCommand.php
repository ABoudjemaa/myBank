<?php

namespace App\Command;

use App\Entity\User; // adapte si tu as une autre entité
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-user',
    description: 'Crée un utilisateur administrateur si il n\'existe pas.',
)]
class CreateUserCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $adminEmail = $_ENV['ADMIN_EMAIL'] ?? 'boudjemaa.amine.2003@gmail.com';
        $adminPassword = $_ENV['ADMIN_PASSWORD'] ?? '12345678';

        $repo = $this->em->getRepository(User::class);
        $existing = $repo->findOneBy(['email' => $adminEmail]);

        if ($existing) {
            $output->writeln('🟢 Un utilisateur admin existe déjà.');
            return Command::SUCCESS;
        }

        $user = new User();
        $user->setFirstName('admin');
        $user->setLastName('admin');
        $user->setEmail($adminEmail);
        $user->setRoles(['ROLE_ADMIN']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $adminPassword));

        $this->em->persist($user);
        $this->em->flush();

        $output->writeln('✅ Utilisateur admin créé avec succès.');
        return Command::SUCCESS;
    }
}
