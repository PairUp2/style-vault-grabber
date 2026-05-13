
-- App role enum + user_roles table (security best-practice)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "user_roles select own or admin" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Site videos table (mirrors database.json structure used by cynex-runtime.js)
CREATE TABLE public.site_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id TEXT,
  original_url TEXT,
  override_url TEXT,
  page TEXT,
  section TEXT,
  label TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'brand',
  is_added BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  is_elementor BOOLEAN NOT NULL DEFAULT false,
  elementor_id TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read videos" ON public.site_videos
FOR SELECT USING (true);

CREATE POLICY "admin write videos" ON public.site_videos
FOR ALL USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_site_videos_original_id ON public.site_videos(original_id);
CREATE INDEX idx_site_videos_category ON public.site_videos(category);

-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author TEXT DEFAULT 'CYNEX Production',
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published posts" ON public.blog_posts
FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin write posts" ON public.blog_posts
FOR ALL USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER touch_site_videos BEFORE UPDATE ON public.site_videos
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER touch_blog_posts BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
