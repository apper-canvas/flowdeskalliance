import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-toastify';
import DealCard from './DealCard';
import { dealService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SortableDealCard = ({ deal, contact, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.Id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DealCard
        deal={deal}
        contact={contact}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

const PipelineBoard = ({ deals, contacts, onEdit, onDelete, onRefresh }) => {
  const [activeId, setActiveId] = useState(null);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const stages = [
    { id: 'Lead', label: 'Lead', color: 'from-gray-400 to-gray-500' },
    { id: 'Qualified', label: 'Qualified', color: 'from-blue-400 to-blue-500' },
    { id: 'Proposal', label: 'Proposal', color: 'from-yellow-400 to-yellow-500' },
    { id: 'Negotiation', label: 'Negotiation', color: 'from-orange-400 to-orange-500' },
    { id: 'Closed', label: 'Closed', color: 'from-green-400 to-green-500' }
  ];

  const getDealsForStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getContactForDeal = (dealContactId) => {
    return contacts.find(contact => contact.Id === dealContactId);
  };

  const calculateStageValue = (stage) => {
    const stageDeals = getDealsForStage(stage);
    return stageDeals.reduce((total, deal) => total + deal.value, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    const deal = deals.find(d => d.Id === active.id);
    setDraggedDeal(deal);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if we're dragging over a stage column
    const overStage = stages.find(stage => stage.id === overId);
    if (overStage) {
      const deal = deals.find(d => d.Id === activeId);
      if (deal && deal.stage !== overStage.id) {
        // Update the deal stage optimistically
        handleStageChange(activeId, overStage.id);
      }
    }
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    setDraggedDeal(null);
  };

  const handleStageChange = async (dealId, newStage) => {
    try {
      await dealService.updateStage(dealId, newStage);
      toast.success(`Deal moved to ${newStage}`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to update deal stage');
    }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const stageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <motion.div 
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        className="flex space-x-6 overflow-x-auto pb-4 min-h-0"
      >
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id);
          const stageValue = calculateStageValue(stage.id);
          
          return (
            <motion.div
              key={stage.id}
              variants={stageVariants}
              className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
            >
              {/* Stage Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stage.color} mr-2`} />
                    {stage.label}
                    <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                      {stageDeals.length}
                    </span>
                  </h3>
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {formatCurrency(stageValue)}
                </div>
              </div>

              {/* Drop Zone */}
              <SortableContext items={stageDeals.map(deal => deal.Id)} strategy={verticalListSortingStrategy}>
                <div
                  className="min-h-64 space-y-3"
                  data-stage={stage.id}
                >
                  <AnimatePresence>
                    {stageDeals.map((deal) => (
                      <SortableDealCard
                        key={deal.Id}
                        deal={deal}
                        contact={getContactForDeal(deal.contactId)}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                  </AnimatePresence>
                  
                  {stageDeals.length === 0 && (
                    <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                      <div className="text-center">
                        <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Drop deals here</p>
                      </div>
                    </div>
                  )}
                </div>
              </SortableContext>
            </motion.div>
          );
        })}
      </motion.div>

      <DragOverlay>
        {activeId && draggedDeal ? (
          <DealCard
            deal={draggedDeal}
            contact={getContactForDeal(draggedDeal.contactId)}
            onEdit={() => {}}
            onDelete={() => {}}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default PipelineBoard;