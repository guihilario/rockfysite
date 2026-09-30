ALTER TABLE orders
  ADD COLUMN area_handoff boolean NOT NULL DEFAULT false,
  ADD COLUMN area_order_id uuid UNIQUE,
  ADD COLUMN area_status text,
  ADD COLUMN area_payment_url text,
  ADD COLUMN area_tenant_slug text,
  ADD COLUMN area_fulfillment_url text,
  ADD COLUMN area_synced_at timestamptz;

CREATE INDEX orders_area_status_idx ON orders (area_status, created_at DESC)
  WHERE area_handoff;
