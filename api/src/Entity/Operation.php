<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\OperationRepository;
use App\State\Operation\OperationCollectionProvider;
use App\State\Operation\OperationItemProvider;
use App\State\Operation\OperationPostProcessor;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: OperationRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: [
                'groups' => [
                    'operation.id',
                    'operation.label',
                    'operation.amount',
                    'operation.date',
                    'operation.category',
                    'category.id',
                    'category.title',
                ]
            ],
            provider: OperationCollectionProvider::class,
        ),
        new Get(
            normalizationContext: [
                'groups' => [
                    'operation.id',
                    'operation.label',
                    'operation.amount',
                    'operation.date',
                    'operation.category',
                    'category.id',
                    'category.title',
                ]
            ],
            provider: OperationItemProvider::class
        ),
        new Post(
            denormalizationContext: [
                'groups' => [
                    'operation.label',
                    'operation.amount',
                    'operation.createdBy',
                    'operation.category',
                ]
            ],
            processor: OperationPostProcessor::class
        ),
        new Patch(
            denormalizationContext: [
                'groups' => [
                    'operation.label',
                    'operation.amount',
                    'operation.category',
                ]
            ]
        ),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['read:Operation:collection']],
)]
class Operation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['operation.id'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['operation.label'])]
    private ?string $label = null;

    #[ORM\Column]
    #[Groups(['operation.amount'])]
    private ?float $amount = null;

    #[ORM\Column]
    #[Groups(['operation.date'])]
    private ?\DateTimeImmutable $date = null;

    #[ORM\ManyToOne(cascade: ['persist'], inversedBy: 'operations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['operation.category'])]
    private ?Category $category = null;

    #[ORM\ManyToOne(inversedBy: 'operations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['operation.createdBy'])]
    private ?User $createdBy = null;

    public function __construct()
    {
        $this->date = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): static
    {
        $this->amount = $amount;

        return $this;
    }

    public function getDate(): ?\DateTimeImmutable
    {
        return $this->date;
    }

    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): static
    {
        $this->createdBy = $createdBy;

        return $this;
    }
}
