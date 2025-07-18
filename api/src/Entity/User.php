<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Symfony\Action\NotFoundAction;
use App\Controller\MeController;
use App\Dto\UserRegisterInput;
use App\Repository\UserRepository;
use App\State\UserRegistrationProcessor;
use Doctrine\ORM\Mapping as ORM;
use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: 'me',
            controller: MeController::class,
            paginationEnabled: false,
            normalizationContext: [
                'groups' => [
                    'user:id',
                    'user.firstName',
                    'user.lastName',
                    'user.email',
                    'user.roles',
                ],
                'openapi_definition_name' => 'User.read',
            ],
            security: "is_granted('ROLE_USER')",
            read: false,
        ),
        new Get(
            controller: NotFoundAction::class,
            openapi: false,
            normalizationContext: [
                'openapi_context' => [
                    'summary' => 'hidden',
                ],
            ],
            output: false,
            read: false,
        ),
        new Post(
            uriTemplate: 'register',
            normalizationContext: ['groups' => [
                'user.firstName',
                'user.lastName',
            ]],
            security: "is_granted('PUBLIC_ACCESS')",
            input: UserRegisterInput::class,
            output: User::class,
            processor: UserRegistrationProcessor::class,
        ),
    ]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface, JWTUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:id'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user.firstName'])]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user.lastName'])]
    private ?string $lastName = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user.email'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column]
    #[Groups(['user.roles'])]
    private array $roles = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public static function createFromPayload($username, array $payload): static
    {
        $user = new self();
//        $user->setId($payload['id']);
        $user->setEmail($username);
        $user->setRoles($payload['roles'] ?? []);

        return $user;
    }

    public function eraseCredentials(): void
    {
        // TODO: Implement eraseCredentials() method.
    }

    public function getUserIdentifier(): string
    {
        return (string)$this->email;
    }
}
