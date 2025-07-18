<?php

namespace App\State\Category;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Category;
use App\Service\UserContextService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class CategoryDeleteProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private UserContextService $userContextService,
    )
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): void
    {
        if (!($data instanceof Category)) {
            throw new \LogicException('Expected Classroom entity.');
        }
//
        $user = $this->userContextService->getAuthenticatedUser();

        $createdBy = $data->getCreatedBy();

        if ($createdBy && $createdBy->getId() !== $user->getId()) {
            throw new \RuntimeException("Vous ne pouvez pas modifier cette catégorie car vous n'êtes pas son créateur.");
        }


        // Supprimer la formation
        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}