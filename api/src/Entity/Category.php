<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\CategoryRepository;
use App\State\Category\CategoryCollectionProvider;
use App\State\Category\CategoryDeleteProcessor;
use App\State\Category\CategoryItemProvider;
use App\State\Category\CategoryPatchProcessor;
use App\State\Category\CategoryPostProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => [
                'category.id',
                'category.title'
            ]],
            provider: CategoryCollectionProvider::class,
        ),
        new Get(
            normalizationContext: ['groups' => [
                'category.id',
                'category.title',
                'category.operations',
            ]],
            provider: CategoryItemProvider::class,
        ),
        new Post(
            denormalizationContext: ['groups' => [
                'category.title',
            ]],
            processor: CategoryPostProcessor::class
        ),
        new Patch(
            denormalizationContext: ['groups' => [
                'category.title',
            ]],
            processor: CategoryPatchProcessor::class,
        ),
        new Delete(
            processor: CategoryDeleteProcessor::class
        )
    ],
    security: 'is_granted("ROLE_USER")',
)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['category.id'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['category.title'])]
    private ?string $title = null;

    /**
     * @var Collection<int, Operation>
     */
    #[ORM\OneToMany(targetEntity: Operation::class, mappedBy: 'category', cascade: ['persist'])]
    #[Groups(['category.operations'])]
    private Collection $operations;

    #[ORM\ManyToOne(inversedBy: 'categories')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['category.createdBy'])]
    private ?User $createdBy = null;

    public function __construct()
    {
        $this->operations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Collection<int, Operation>
     */
    public function getOperations(): Collection
    {
        return $this->operations;
    }

    public function addOperation(Operation $operation): static
    {
        if (!$this->operations->contains($operation)) {
            $this->operations->add($operation);
            $operation->setCategory($this);
        }

        return $this;
    }

    public function removeOperation(Operation $operation): static
    {
        if ($this->operations->removeElement($operation)) {
            // set the owning side to null (unless already changed)
            if ($operation->getCategory() === $this) {
                $operation->setCategory(null);
            }
        }

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
